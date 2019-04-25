"use strict";

// get width and height
var w = parseInt(d3.select("#map").style("width"));
var h = parseInt(d3.select("#map").style("height"));

// create svg
var svg = d3
	.select("#map")
	.append("svg")
	.attr("width", w)
	.attr("height", h);

// initial scale and translation (makes mercator projection fit screen)
var scaleInit = (h / (2 * Math.PI)) * 1.7;
var transInit = [w / 2, h * 0.6];

// define projection
var projection = d3
	.geoMercator()
	.scale(scaleInit)
	.translate(transInit);

// define path generator
var path = d3.geoPath().projection(projection);

var mapG = svg.append("g").attr("id", "mapG"); // g for the map
var dotG = svg.append("g").attr("id", "dotG"); // g for dots or anything else we plot on top

var arc = d3
	.arc()
	.innerRadius(0)
	.outerRadius(function(d) {
		return d3
			.scaleSqrt()
			.domain(codesRange[d.code])
			.range([0, 15])(d.score);
	})
	.cornerRadius(5);

// vars for glyphs
const rCircle = 4;
const fillCircle = "#c4ccd0";

// set up zoom
var zoom = d3
	.zoom()
	.scaleExtent([0.7, 50])
	.on("zoom", zooming);

svg.call(zoom);

svg.on("click", selectedAgt.clear);

function zooming() {
	// keep stroke-width constant at different zoom levels
	mapG.style("stroke-width", 1 / d3.event.transform.k + "px");
	// zoom map
	mapG.attr("transform", d3.event.transform);
	// semantic zoom flowers
	dotG.selectAll("g").attr("transform", function(d) {
		return "translate(" + d3.event.transform.apply(projection(d.loc)) + ")";
	});
	// make sure selected glyph, if any, stays 2x size
	if (selectedAgt.get()) {
		d3.select("#glyph" + selectedAgt.get().AgtId).attr("transform", function(
			d
		) {
			return (
				"translate(" +
				d3.event.transform.apply(projection(d.loc)) +
				") scale(2)"
			);
		});
	}
}

// buttons for zoom
var zoomG = svg
	.append("g")
	.attr("transform", "translate(" + (w - 35) + "," + (h - 60) + ")");

zoomG
	.append("rect")
	.attr("x", 0)
	.attr("y", 0)
	.attr("width", 25)
	.attr("height", 25)
	.style("fill", "#fff")
	.style("stroke", "#000")
	.style("stroke-width", "#1px")
	.on("mouseover", function() {
		d3.select(this).style("fill", "#ccc");
	})
	.on("mouseout", function() {
		d3.select(this).style("fill", "#fff");
	})
	.on("click", function() {
		// zoom in
		zoom.scaleBy(svg.transition().duration(200), 1.3);
	});

zoomG
	.append("rect")
	.attr("x", 0)
	.attr("y", 25)
	.attr("width", 25)
	.attr("height", 25)
	.style("fill", "#fff")
	.style("stroke", "#000")
	.style("stroke-width", "#1px")
	.on("mouseover", function() {
		d3.select(this).style("fill", "#ccc");
	})
	.on("mouseout", function() {
		d3.select(this).style("fill", "#fff");
	})
	.on("click", function() {
		zoom.scaleBy(svg.transition().duration(200), 1 / 1.3);
		// zoom out
	});

// plus sign
zoomG
	.append("line")
	.attr("x1", 7.5)
	.attr("x2", 17.5)
	.attr("y1", 12.5)
	.attr("y2", 12.5)
	.style("stroke", "#000")
	.attr("stroke-width", "2px")
	.attr("pointer-events", "none");

zoomG
	.append("line")
	.attr("x1", 12.5)
	.attr("x2", 12.5)
	.attr("y1", 7.5)
	.attr("y2", 17.5)
	.style("stroke", "#000")
	.attr("stroke-width", "2px")
	.attr("pointer-events", "none");

// minus sign
zoomG
	.append("line")
	.attr("x1", 7.5)
	.attr("x2", 17.5)
	.attr("y1", 37.5)
	.attr("y2", 37.5)
	.style("stroke", "#000")
	.attr("stroke-width", "2px")
	.attr("pointer-events", "none");

function combineDataPoly(data, world) {
	// filter for intra agreements only
	var data_intra = data.filter(function(d) {
		return d.Agtp == "Intra";
	});

	// nest by the first country on the list
	data_intra = d3.group(data_intra, d => d.Con[0]);

	var newData = [];

	for (const [con, agts] of data_intra.entries()) {
		var cen = world.features.find(function(d) {
			return d.properties.name == con;
		});

		// Palestine and Kurdistan are not internationally recognised and therefore not on the map
		// place them at their approximate location/within the recognised country
		if (con == "Palestine") {
			cen = world.features.find(function(d) {
				return d.properties.name == "Israel";
			});
		}
		if (con == "Kurds-Kurdistan") {
			cen = world.features.find(function(d) {
				return d.properties.name == "Iraq";
			});
		}

		if (cen != undefined) {
			var pts = randomGeoPoints(cen.geometry, agts.length);

			// create one long list of all agreements
			newData.push(
				...agts.map(function(d, i) {
					d.loc = pts[i];
					return d;
				})
			);
		} else {
			console.log(con + " cannot be found on the map");
		}
	}

	return newData;
}

function updateGlyphs(locdata) {
	// draw glyphs onto dotG

	// get current bounding box (in lat lon)
	var bbox = getBoundingBox();

	// filter data for the visible dots only, also filter out undef ones
	var locdata = locdata.filter(function(d) {
		return filterBBox(bbox, d.loc);
	});

	dotG.selectAll("*").remove();

	// add new ones
	var circle = dotG
		.selectAll("g")
		.data(locdata)
		.enter()
		.append("g")
		.classed("glyph", true)
		.attr("id", d => "glyph" + d.AgtId)
		// .merge(circle)
		.attr("transform", function(d) {
			return (
				"translate(" +
				d3.zoomTransform(svg.node()).apply(projection(d.loc)) +
				")"
			);
		});

	circle
		.append("circle")
		.attr("cx", 0)
		.attr("cy", 0)
		.attr("r", rCircle)
		.style("fill", fillCircle)
		.style("fill-opacity", 1);

	circle
		.selectAll(".arc")
		.data(function(d) {
			var incr = tau / codes.length;
			var obj = [];

			for (var i = 0; i < codes.length; i++) {
				if (d[codes[i]]) {
					obj.push({
						startAngle: i * incr,
						endAngle: (i + 1) * incr,
						code: codes[i],
						score: d[codes[i]]
					});
				}
			}
			return obj;
		})
		.enter()
		.append("path")
		.attr("d", arc)
		.style("fill", d => codeColour(d.code));

	circle
		.on("click", function(d) {
			selectedAgt.clickOn(d);
			event.stopPropagation();
		})
		.on("mouseover", onmouseover)
		.on("mouseout", onmouseout);

	return circle;
}

function getBoundingBox() {
	// computes bounding box of currently visible part of the map in terms of lat/lon

	var mapBounds = mapG.node().getBBox();
	var mapTrans = d3.zoomTransform(svg.node());

	var l = mapTrans.x + mapBounds.x * mapTrans.k;
	var r = l + mapBounds.width * mapTrans.k;
	var t = mapTrans.y + mapBounds.y * mapTrans.k;
	var b = t + mapBounds.height * mapTrans.k;

	// compare to bounds of svg (visible part)
	l = l > 0 ? -180 : projection.invert([0, NaN])[0];
	r = r < w ? 180 : projection.invert([w, NaN])[0];
	t = t > 0 ? 85 : projection.invert([NaN, 0])[1];
	b = b < h ? -85 : projection.invert([NaN, h])[1];

	return { l: l, r: r, t: t, b: b };
}

function filterBBox(bbox, loc) {
	// check if point at lon/lat is within the visible part of the map
	return (
		loc != undefined &&
		(bbox.l < loc[0] && loc[0] < bbox.r && bbox.b < loc[1] && loc[1] < bbox.t)
	);
}

function randomGeoPoints(geometry, nPoints) {
	// creates a random point in a country as defined by its geometry
	var bbox = d3.geoBounds(geometry);
	var w = bbox[0][0],
		s = bbox[0][1],
		e = bbox[1][0],
		n = bbox[1][1];

	// array for random points
	var pts = [];

	// if the longitude at the west end of the country is larger than at the
	// east end, the country must span across the 180 line
	if (w > e) {
		var prop = [[w, 180], [-180, e]].map(d => d[1] - d[0]);
		var cut = prop[0] / (prop[0] + prop[1]);

		// a while loop would be more elegant but also more dangerous
		for (var i = 0; i < 1000; i++) {
			var rand = Math.random();
			var randLon =
				rand < cut
					? w + rand * d3.sum(prop)
					: -180 + rand * d3.sum(prop) - prop[0];
			var randomPoint = [randLon, s + Math.random() * (n - s)];
			var contained = d3.geoContains(geometry, randomPoint);
			if (contained) {
				pts.push(randomPoint);
			}
			if (pts.length >= nPoints) {
				break;
			}
		}
	}
	// if this isn't the case it's just regular maths
	else {
		for (var i = 0; i < 1000; i++) {
			var randomPoint = [
				w + Math.random() * (e - w),
				s + Math.random() * (n - s)
			];
			var contained = d3.geoContains(geometry, randomPoint);
			if (contained) {
				pts.push(randomPoint);
			}
			if (pts.length >= nPoints) {
				break;
			}
		}
	}

	// log warning if there are not enough points
	if (pts.length < nPoints) {
		console.log(
			"WARNING! In " +
				i +
				" iterations, \
			not enough points could be generated for " +
				geometry
		);
	}
	return pts;
}
