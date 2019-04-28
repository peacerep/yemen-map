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
