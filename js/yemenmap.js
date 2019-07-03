"use strict";

function drawYemenMap(data) {
	console.log(data.filter(d => !d.local));
	dotG.selectAll("*").remove();

	var local = dotG
		.selectAll(".localGlyph")
		.data(data.filter(d => d.local))
		.enter()
		.append("g")
		.classed("glyphContainer", true)
		.attr("id", d => "glyph" + d.id)
		.attr(
			"transform",
			d =>
				"translate(" +
				d3
					.zoomTransform(svg.node())
					.apply(projection([d.localLon, d.localLat])) +
				")"
		);

	local
		.append("circle")
		.attr("r", glyphR * 0.15)
		.attr("pointer-events", "none");

	// grow flower petals
	local
		.selectAll("path")
		.data(d => petalData(d))
		.enter()
		.append("path")
		.classed("petal", true)
		.attr("d", arcMin)
		.style("fill", d => d.colour);

	var national = natG
		.selectAll(".nationalGlyph")
		.data(data.filter(d => !d.local))
		.enter()
		.append("g")
		.classed("glyphContainer", true)
		.attr("id", d => "glyph" + d.id)
		.attr("transform", (d, i) => "translate(" + squarePos(i) + ")");

	national
		.append("circle")
		.attr("r", glyphR * 0.15)
		.attr("pointer-events", "none");

	national
		.selectAll("path")
		.data(d => petalData(d))
		.enter()
		.append("path")
		.classed("petal", true)
		.attr("d", arcMin)
		.style("fill", d => d.colour);
}

function squarePos(i) {
	var dist = natBoxW / natBoxN;

	var x = dist / 2 + (i % natBoxN) * dist;
	var y = natBoxT + dist / 2 + ((i - (i % natBoxN)) / natBoxN) * dist;

	return [x, y];
}
