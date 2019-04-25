"use strict";

function filterData(data, f) {
	// console.log(data, f)

	var filtered = data.filter(function(d) {
		if (d.Year >= f.year[0] && d.Year <= f.year[1]) {
			// year check passed
			if (f.codes.codes.length == 0) {
				var c1 = true;
			} else {
				if (f.codes.any) {
					var c1 = f.codes.codes.some(function(code) {
						return d[code] > 0;
					});
				} else {
					var c1 = f.codes.codes.every(function(code) {
						return d[code] > 0;
					});
				}
			}

			if (c1) {
				// codes check passed
				if (f.cons.cons.length == 0) {
					return true; // cons check passed
				} else {
					if (f.cons.any) {
						return f.cons.cons.some(function(con) {
							return d.Con.findIndex(c => c == con) != -1;
						});
					} else {
						return f.cons.cons.every(function(con) {
							return d.Con.findIndex(c => c == con) != -1;
						});
					}
				}
			} else {
				return false;
			} // codes check failed
		} else {
			return false;
		} // year check failed
	});
	return filtered;
}

function slider(divID, min, max) {
	var range = [min, max + 1];

	// set width and height of svg
	var w = parseInt(
		window.getComputedStyle(document.getElementById(divID)).width
	);
	// var w = 270
	var h = 65;
	var margin = { top: 10, bottom: 15, left: 10, right: 10 };
	var labelpadding = 38; // keeps the labels from sliding out of sight

	// dimensions of slider bar
	var width = w - margin.left - margin.right;
	var height = h - margin.top - margin.bottom;

	// create x scale
	var x = d3
		.scaleLinear()
		.domain(range) // data space
		.range([0, width]); // display space

	// create svg and translated g
	var svg = d3
		.select("#" + divID)
		.append("svg")
		.attr("width", w)
		.attr("height", h);
	const g = svg
		.append("g")
		.attr("transform", `translate(${margin.left}, ${margin.top})`);

	// draw background lines
	g.append("g")
		.selectAll("line")
		.data(d3.range(range[0], range[1] + 1))
		.enter()
		.append("line")
		.attr("x1", d => x(d))
		.attr("x2", d => x(d))
		.attr("y1", 0)
		.attr("y2", height)
		.style("stroke", "#ccc");

	// labels
	var labelL = g
		.append("text")
		.attr("id", "labelleft")
		.attr("x", 0)
		.attr("y", height)
		.text(range[0]);

	var labelR = g
		.append("text")
		.attr("id", "labelright")
		.attr("x", 0)
		.attr("y", height)
		.text(range[1]);

	// define brush
	var brush = d3
		.brushX()
		.extent([[0, 0], [width, height]])
		.on("brush", function() {
			var s = d3.event.selection;
			// update and move labels
			labelL
				.attr("x", s[0] < labelpadding ? labelpadding : s[0])
				.text(Math.round(x.invert(s[0])));
			labelR
				.attr("x", s[1] > width - labelpadding ? width - labelpadding : s[1])
				.text(Math.round(x.invert(s[1])) - 1);
			// move brush handles
			handle.attr("display", null).attr("transform", function(d, i) {
				return "translate(" + [s[i], -height / 4] + ")";
			});
			// update selection
			// console.log(s.map(d => Math.round(x.invert(d))))
		})
		.on("end", function() {
			if (!d3.event.sourceEvent) return;
			var d0 = d3.event.selection.map(x.invert);
			var d1 = d0.map(Math.round);
			d3.select(this)
				.transition()
				.call(d3.event.target.move, d1.map(x));
			let event = new Event("change");
			eventHandler.dispatchEvent(event);
		});

	// append brush to g
	var gBrush = g
		.append("g")
		.attr("class", "brush")
		.call(brush);

	// add brush handles (from https://bl.ocks.org/Fil/2d43867ba1f36a05459c7113c7f6f98a)
	var brushResizePath = function(d) {
		var e = +(d.type == "e"),
			x = e ? 1 : -1,
			y = height / 2;
		return (
			"M" +
			0.5 * x +
			"," +
			y +
			"A6,6 0 0 " +
			e +
			" " +
			6.5 * x +
			"," +
			(y + 6) +
			"V" +
			(2 * y - 6) +
			"A6,6 0 0 " +
			e +
			" " +
			0.5 * x +
			"," +
			2 * y +
			"Z" +
			"M" +
			2.5 * x +
			"," +
			(y + 8) +
			"V" +
			(2 * y - 8) +
			"M" +
			4.5 * x +
			"," +
			(y + 8) +
			"V" +
			(2 * y - 8)
		);
	};

	var handle = gBrush
		.selectAll(".handle--custom")
		.data([{ type: "w" }, { type: "e" }])
		.enter()
		.append("path")
		.attr("class", "handle--custom")
		.attr("stroke", "#000")
		.attr("fill", "#eee")
		.attr("cursor", "ew-resize")
		.attr("d", brushResizePath);

	// override default behaviour - clicking outside of the selected area
	// will select a small piece there rather than deselecting everything
	// https://bl.ocks.org/mbostock/6498000
	gBrush
		.selectAll(".overlay")
		.each(function(d) {
			d.type = "selection";
		})
		.on("mousedown touchstart", brushcentered);

	function brushcentered() {
		var dx = x(1) - x(0), // Use a fixed width when recentering.
			cx = d3.mouse(this)[0],
			x0 = cx - dx / 2,
			x1 = cx + dx / 2;
		d3.select(this.parentNode).call(
			brush.move,
			x1 > width ? [width - dx, width] : x0 < 0 ? [0, dx] : [x0, x1]
		);
	}

	// select entire range
	var resetBrush = function() {
		gBrush.call(brush.move, range.map(x));
	};

	var getRange = function() {
		var range = d3
			.brushSelection(gBrush.node())
			.map(d => Math.round(x.invert(d)));
		return [range[0], range[1] - 1];
	};

	resetBrush();

	return { getRange: getRange, resetBrush: resetBrush };
}
