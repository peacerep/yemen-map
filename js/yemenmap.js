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
		.attr("r", glyphR * 1.2)
		.classed("glyphHighlightCircle", true);

	var glyphs = d3.selectAll(".glyphContainer");

	glyphs.append("circle").attr("r", glyphR * 0.15);
	// .attr("pointer-events", "none");

	glyphs
		.selectAll("path")
		.data(d => petalData(d))
		.enter()
		.append("path")
		.classed("petal", true)
		.attr("d", arcMin)
		.style("fill", d => d.colour);

	glyphs
		.on("mouseover", mouseoverAgt)
		.on("mouseout", mouseoutAgt)
		.on("click", function(d) {
			selectedAgt.clickOn(d);
			event.stopPropagation();
		});
}

function squarePos(i) {
	var dist = natBoxW / natBoxN;

	var x = dist / 2 + (i % natBoxN) * dist;
	var y = natBoxT + dist / 2 + ((i - (i % natBoxN)) / natBoxN) * dist;

	return [x, y];
}

const countryLabels = [
	{ label: "Yemen", lon: 47.5, lat: 16 },
	{ label: "Djibouti", lon: 41.9, lat: 11.41 },
	{ label: "Saudi Arabia", lon: 46.8, lat: 18.8 },
	{ label: "Somaliland", lon: 47.3, lat: 10.7 },
	{ label: "Somalia", lon: 49.7, lat: 10.85 },
	{ label: "Eritrea", lon: 38.2, lat: 16.4 },
	{ label: "Oman", lon: 53.8, lat: 18.4 },
	{ label: "Ethiopia", lon: 40.5, lat: 12.5 }
];

const cityLabels = [
	{ label_en: "Sanaa", lon: 44.207, lat: 15.355 },
	{ label_en: "Al Hudaydah", lon: 42.955, lat: 14.798 },
	{ label_en: "Ta‘izz", lon: 44.021, lat: 13.58 },
	{ label_en: "Aden", lon: 45.037, lat: 12.779 },
	{ label_en: "Mukalla", lon: 49.124, lat: 14.542 },
	{ label_en: "Ibb", lon: 44.183, lat: 13.967 },
	{ label_en: "Dhamār", lon: 44.405, lat: 14.543 },
	{ label_en: "‘Amrān", lon: 43.944, lat: 15.659 },
	{ label_en: "Sayyān", lon: 44.324, lat: 15.172 },
	{ label_en: "Zabīd", lon: 43.315, lat: 14.195 }
];
