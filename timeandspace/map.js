"use strict";

// get width and height
var w_map = parseInt(d3.select("#map").style("width"));
var h_map = parseInt(d3.select("#map").style("height"));

// create svg
var svg = d3
	.select("#map")
	.append("svg")
	.attr("width", w_map)
	.attr("height", h_map);

// initial scale and translation (makes mercator projection fit screen)
var scaleInit = (h_map / (2 * Math.PI)) * 1.7;
var transInit = [w_map / 2, h_map * 0.6];

// define projection
var projection = d3
	.geoMercator()
	.scale(scaleInit)
	.translate(transInit);

// define path generator
var path = d3.geoPath().projection(projection);

var mapG = svg.append("g").attr("id", "mapG"); // g for the map
var dotG = svg.append("g").attr("id", "dotG"); // g for dots or anything else we plot on top
var labG = svg.append("g").attr("id", "labG"); // g for country labels
var popG = svg.append("g").attr("id", "popG"); // g for popup circles
var popupControlsG = svg.append("g").attr("id", "popupControlsG");

// tooltip for country names
var tooltipMap = labG
	.attr("transform", "translate(-100,-100)")
	.attr("id", "tooltipMap")
	.style("pointer-events", "none")
	.append("text")
	.attr("class", "tooltipText");

// vars for dots
const rCircle = 1.5;

// set up zoom
var zoom = d3
	.zoom()
	.scaleExtent([0.7, 50])
	.on("zoom", zooming);

svg.call(zoom);

svg.on("click", selectedAgt.clear);

function zooming() {
	mapG.style("stroke-width", 1 / d3.event.transform.k + "px");
	mapG.attr("transform", d3.event.transform);

	// semantic zoom
	dotG
		.selectAll(".glyphContainer")
		.attr(
			"transform",
			d => "translate(" + d3.event.transform.apply(projection(d.loc)) + ")"
		);
}

// zoom buttons (bottom right of map)
var zoomG = svg
	.append("g")
	.attr("transform", "translate(" + (w_map - 35) + "," + (h_map - 60) + ")")
	.classed("zoomButton", true);

// zoom in (+) button
zoomG
	.append("rect")
	.attr("x", 0)
	.attr("y", 0)
	.attr("width", 25)
	.attr("height", 25)
	.on("click", function() {
		zoom.scaleBy(svg.transition().duration(200), 1.3);
	});

// zoom out (-) button
zoomG
	.append("rect")
	.attr("x", 0)
	.attr("y", 25)
	.attr("width", 25)
	.attr("height", 25)
	.on("click", function() {
		zoom.scaleBy(svg.transition().duration(200), 1 / 1.3);
	});

// plus and minus signs on buttons
zoomG
	.selectAll(".zoomLabel")
	.data([
		{ x1: 7.5, x2: 17.5, y1: 12.5, y2: 12.5 },
		{ x1: 12.5, x2: 12.5, y1: 7.5, y2: 17.5 },
		{ x1: 7.5, x2: 17.5, y1: 37.5, y2: 37.5 }
	])
	.enter()
	.append("line")
	.attr("x1", d => d.x1)
	.attr("x2", d => d.x2)
	.attr("y1", d => d.y1)
	.attr("y2", d => d.y2);

// hidden: popup controls

// add buttons to the side of the circle
var button = popupControlsG
	.classed("popupSortButtons", true)
	.attr("transform", "translate(-100, -100)");

var textOffset = 5;
var fontSize = 15;

// Heading
button
	.append("text")
	.text("SORT BY:")
	.attr("y", -120)
	.style("fill", "#333");

// Date

button
	.append("circle")
	.classed("selected", true)
	.attr("cy", -75)
	.attr("r", 35)
	.on("click", function() {
		sortGlyphsBy(sortByDate, this);
	});

button
	.append("text")
	.style("font-size", fontSize + "px")
	.text("Date")
	.attr("y", -75 + textOffset);

// Number of Codes

button
	.append("circle")
	.attr("cy", 0)
	.attr("r", 35)
	.on("click", function() {
		sortGlyphsBy(sortByNCodes, this);
	});

var text1 = button.append("text").attr("y", textOffset);
text1
	.selectAll("tspan")
	.data(["Number", "of Codes"])
	.enter()
	.append("tspan")
	.attr("x", 0)
	.attr("y", text1.attr("y"))
	.attr("dy", function(d, i) {
		return ((i * 2 - 1) * fontSize) / 2;
	})
	.text(d => d);

// Specific Code

button
	.append("circle")
	.attr("id", "popupSort3")
	.attr("cy", 75)
	.attr("r", 35)
	.on("click", function() {
		// wiggle dots to show this can't be clicked
		d3.selectAll(".popupSortCodeCircle")
			.transition()
			.duration(100)
			.attr("r", 13)
			.transition()
			.duration(100)
			.attr("r", 10);
	});

var text2 = button.append("text").attr("y", 75 + textOffset);
text2
	.selectAll("tspan")
	.data(["Specific", "Code"])
	.enter()
	.append("tspan")
	.attr("x", 0)
	.attr("y", text2.attr("y"))
	.attr("dy", function(d, i) {
		return ((i * 2 - 1) * fontSize) / 2;
	})
	.text(d => d);

button
	.append("g")
	.attr("transform", "translate(0, 75)")
	.selectAll("circle")
	.data(codes)
	.enter()
	.append("circle")
	.classed("popupSortCodeCircle", true)
	.attr("r", 10)
	.attr("cx", function(d, i) {
		var alpha = i * (tau / 16) - 0.0625 * tau;
		return Math.cos(alpha) * 55;
	})
	.attr("cy", function(d, i) {
		var alpha = i * (tau / 16) - 0.0625 * tau;
		return Math.sin(alpha) * 55;
	})
	.style("fill", d => codeColour(d))
	.on("click", function(d) {
		d3.selectAll(".popupSortButtons .selected").classed("selected", false);
		d3.select("#popupSort3").classed("selected", true);
		d3.select(this).classed("selected", true);

		d3.selectAll(".popupGlyph")
			.sort(function(a, b) {
				return sortByCode(a, b, d);
			})
			.transition()
			.duration(100)
			.attr("transform", function(d, i) {
				var posOnPath = d3
					.select(".popupBackgroundSpiral")
					.node()
					.getPointAtLength(i * delta);
				return "translate(" + posOnPath.x + "," + posOnPath.y + ")";
			});
	});
