function mouseoverCountry(that, d) {
	var polygon = d3.select(that);

	polygon.classed("hover", true).moveToFront();

	// grow flowers out of dots
}

function mouseoutCountry(that, d) {
	d3.select(that).classed("hover", false);

	// delete petals again
}

function clickCountry(con, data, world) {
	// white 70% opaque rectangle to cover entire map
	var bgRect = d3.select("#popG").append("g");
	bgRect
		.append("rect")
		.attr("height", h_map)
		.attr("width", w_map)
		.style("fill", "#fff")
		.style("fill-opacity", 0.7)
		.on("click", function() {
			d3.select("#popG")
				.selectAll("*")
				.remove();
		});
	// (X) button to close
	bgRect
		.append("circle")
		.attr("cx", w_map - 40)
		.attr("cy", 40)
		.attr("r", 30)
		.style("fill", "#ddd")
		.style("fill-opacity", 1);
	bgRect
		.selectAll("line")
		.data([[[0, 30], [0, 30]], [[0, 30], [30, 0]]])
		.enter()
		.append("line")
		.attr("transform", "translate(" + (w_map - 55) + "," + 25 + ")")
		.attr("x1", d => d[0][0])
		.attr("x2", d => d[0][1])
		.attr("y1", d => d[1][0])
		.attr("y2", d => d[1][1])
		.style("stroke", "#555")
		.style("stroke-width", 3)
		.style("stroke-linecap", "round")
		.style("fill", "none");

	// filter for selected country only, nest by process ID
	var con_data = d3
		.nest()
		.key(d => d.processid)
		.entries(
			data.filter(function(d) {
				return d.con.indexOf(con) != -1;
			})
		);

	// calculate circle pack for each peace process separately
	con_data.forEach(function(pr, i) {
		// list of all countries involved in the PP
		pr.cons = new Set(
			pr.values
				.map(d => d.con)
				.reduce(function(a, b) {
					return a.concat(b);
				})
		);

		// circle pack
		d3.packSiblings(
			pr.values.map(function(d) {
				d.r = glyphR;
				return d;
			})
		);
		pr.outercircle = d3.packEnclose(pr.values);
		pr.r = pr.outercircle.r;
	});

	d3.packSiblings(con_data);
	// console.log(con_data)

	// get all countries connected to the selected one
	var all_cons = con_data
		.map(d => d.cons)
		.reduce(function(a, b) {
			return new Set([...a, ...b]);
		});
	all_cons = [...all_cons];

	// get geometry (only for those that can be found!)
	var all_cons_geo = world.features.filter(
		d => all_cons.indexOf(d.properties.name) > -1
	);
	// console.log(all_cons, all_cons_geo)

	// get bbox around all polygons
	var all_cons_bounds = all_cons_geo
		.map(d => path.bounds(d))
		.reduce(function(a, b) {
			return [
				[d3.min([a[0][0], b[0][0]]), d3.min([a[0][1], b[0][1]])],
				[d3.max([a[1][0], b[1][0]]), d3.max([a[1][1], b[1][1]])]
			];
		});

	// calculate transform to fit everything on screen
	var w = all_cons_bounds[1][0] - all_cons_bounds[0][0];
	var h = all_cons_bounds[1][1] - all_cons_bounds[0][1];
	var scale = d3.min([w_map / w, h_map / h]);
	var translate_x = (w - w * scale) / 2;
	var translate_y = (h - h * scale) / 2;

	// draw countries with current projection/zoom
	// draw map
	var all_cons_map = popG
		.append("g")
		.attr(
			"transform",
			"scale(" + scale + ") translate(" + translate_x + "," + translate_y + ")"
		)
		.selectAll("path")
		.data(all_cons_geo)
		.enter()
		.append("path")
		.attr("id", function(d) {
			return "popup_" + d.id;
		})
		.attr("d", path)
		.classed("popup land", true);

	// scale
	// translate

	// draw circles
	var g = d3
		.select("#popG")
		.selectAll("g")
		.data(con_data)
		.enter()
		.append("g")
		.attr("transform", function(d) {
			return (
				"translate(" + (0.5 * w_map + d.x) + "," + (0.5 * h_map + d.y) + ")"
			);
		});

	// big background circle
	g.append("circle")
		.attr("x", 0)
		.attr("y", 0)
		.attr("r", d => d.outercircle.r)
		.style("fill", "#3A3A3A");

	// small circle for each agreement
	var glyph = g
		.selectAll(".glyph")
		.data(d => d.values)
		.enter()
		.append("g")
		.classed("glyph", true)
		.attr("transform", d => "translate(" + d.x + "," + d.y + ")");

	glyph
		.append("circle")
		.attr("r", glyphR * 0.3)
		.style("fill", "#EAE4E2");

	// add petals
	glyph
		.selectAll(".arc")
		.data(function(d) {
			var activeCodes = [];
			for (var i = 0; i < codes.length; i++) {
				if (d[codes[i]]) {
					activeCodes.push(codes[i]);
				}
			}
			if (!activeCodes.length) {
				return [];
			} else {
				var incr = tau / codes.length;
				var obj = [];
				for (var i = 0; i < codes.length; i++) {
					if (activeCodes.includes(codes[i])) {
						obj.push({
							startAngle: i * incr,
							endAngle: (i + 1) * incr,
							colour: codeColour(codes[i])
						});
					}
				}
				return obj;
			}
		})
		.enter()
		.append("path")
		.attr("d", arc)
		.style("fill", d => d.colour);
}

var arc = d3
	.arc()
	.innerRadius(0)
	.outerRadius(glyphR * 0.8)
	.cornerRadius(5);
