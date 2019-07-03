"use strict";

// Wait for the DOM to finish loading
// if (document.readyState === "interactive") { init(); }

////////////////////////////////////////////////////////////////////////////////
// Initialise svg and group elements for map and timeline
////////////////////////////////////////////////////////////////////////////////

// Map
var w_map = parseInt(d3.select("#map").style("width"));
var h_map = parseInt(d3.select("#map").style("height"));

var svg = d3
	.select("#map")
	.append("svg")
	.attr("width", w_map)
	.attr("height", h_map);

var mapG = svg.append("g").attr("id", "mapG"); // g for the map
var dotG = svg.append("g").attr("id", "dotG"); // g for dots or anything else we plot on top
var labG = svg.append("g").attr("id", "labG"); // g for country labels
// var popG = svg.append("g").attr("id", "popG"); // g for popup circles
// var popupControlsG = svg.append("g").attr("id", "popupControlsG");
var natG = svg.append("g").attr("id", "natG"); // g for box with national agreements

natG.attr(
	"transform",
	"translate(" + (w_map - natBoxW - 10) + "," + (h_map - natBoxH) / 2 + ")"
);

natG
	.append("rect")
	.attr("x", 0)
	.attr("y", 0)
	.attr("width", natBoxW)
	.attr("height", natBoxH);

natG
	.append("text")
	.attr("x", natBoxW / 2)
	.attr("y", 10)
	.text("National Level Agreements");

////////////////////////////////////////////////////////////////////////////////
// Set up map
////////////////////////////////////////////////////////////////////////////////

// initial scale and translation (makes mercator projection fit screen)
var scaleInit = (h_map / tau) * 2.3;
var transInit = [w_map * 0.5, h_map * 0.75];

// define projection
var projection = d3
	.geoMercator()
	.scale(scaleInit)
	.translate(transInit);

// zoom to Yemen
var yemenBox = {
	l: 38,
	r: 60,
	t: 22,
	b: 10
};

var bbox_yemen = {
	type: "Polygon",
	coordinates: [
		[
			[yemenBox.l, yemenBox.t],
			[yemenBox.r, yemenBox.t],
			[yemenBox.r, yemenBox.b],
			[yemenBox.l, yemenBox.b],
			[yemenBox.l, yemenBox.t]
		]
	]
};

projection.fitSize([w_map, h_map], bbox_yemen);

// define path generator
var path = d3.geoPath().projection(projection);

// tooltip for country names
var tooltipMap = labG
	.attr("transform", "translate(-100,-100)")
	.attr("id", "tooltipMap")
	.style("pointer-events", "none")
	.append("text")
	.attr("class", "tooltipText");

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
			d =>
				"translate(" +
				d3.event.transform.apply(projection([d.localLon, d.localLat])) +
				")"
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

////////////////////////////////////////////////////////////////////////////////
// Initialise event listeners, buttons, etc.
////////////////////////////////////////////////////////////////////////////////

// Button to hide / show global filters
d3.select("#expandFilters").on("click", function() {
	// check if currently hidden
	var currentState = d3.select("#filterContainer").classed("hidden");

	// change button text
	d3.select("#expandFilters").text(
		currentState ? "Hide Filters" : "Show Filters"
	);

	// toggle filter visibility
	d3.select("#filterContainer").classed("hidden", !currentState);
});

// Buttons to select all / deselect all in the global filters box

d3.select("#selectAllCodes").on("click", function() {
	// check all checkboxes
	d3.selectAll("#codesCheckboxes input").property("checked", true);
	let event = new Event("change");
	eventHandler.dispatchEvent(event);
});

d3.select("#deselectAllCodes").on("click", function() {
	// uncheck all checkboxes
	d3.selectAll("#codesCheckboxes input").property("checked", false);
	let event = new Event("change");
	eventHandler.dispatchEvent(event);
});

d3.select("#selectAllCons").on("click", function() {
	// check all checkboxes
	d3.selectAll("#conDropdown input").property("checked", true);
	let event = new Event("change");
	eventHandler.dispatchEvent(event);
});

d3.select("#deselectAllCons").on("click", function() {
	// uncheck all checkboxes
	d3.selectAll("#conDropdown input").property("checked", false);
	let event = new Event("change");
	eventHandler.dispatchEvent(event);
});

// Add codes checkboxes
makeCodesCheckboxes(true);

// Initialise infobox
agtDetails(null);

// Initialise slider
var timeSlider = initSlider();

////////////////////////////////////////////////////////////////////////////////
// Load data
////////////////////////////////////////////////////////////////////////////////

d3.csv("data/yemen_merge.csv", parseData)
	.then(function(data) {
		console.log(data);

		// Initialise reset button for filters
		d3.select("#reset-filters").on("click", resetFilters);
		resetFilters();

		// Draw timeline
		initTimeline(data);

		// Load geojson world map
		d3.json("data/world-110m-custom.geojson")
			.then(function(world) {
				// draw map
				mapG
					.append("g")
					.selectAll("path")
					.data(world.features)
					.enter()
					.append("path")
					.attr("id", function(d) {
						return "path" + d.id;
					})
					.attr("d", path)
					.classed("land", true);
				// .on("mouseover", function(d) {
				// 	mouseoverCountry(this, d);
				// })
				// .on("mouseout", function(d) {
				// 	mouseoutCountry(this, d);
				// })
				// .on("click", function(d) {
				// 	var filters = {
				// 		year: timeSlider.getRange(),
				// 		cons: { any: true, cons: [d.properties.name] },
				// 		codes: getSelectedCodes()
				// 	};
				// 	clickCountry(
				// 		d.properties.name,
				// 		filterData(
				// 			locdata[locdata.findIndex(e => e.con == d.properties.name)]
				// 				.agts,
				// 			filters
				// 		),
				// 		world
				// 	);
				// 	// update timeline
				// 	initTimeline(filterData(data, filters), filters.year);
				// });

				// Match data points with locations on the map and draw dot map
				// const locdata = makeDotmapData(data, world);
				// drawDotmap(locdata);

				// Draw all agreements
				drawYemenMap(data);

				// Listen for changes in filters
				d3.selectAll(".input").on("change", function() {
					var filters = {
						year: timeSlider.getRange(),
						cons: getSelectedCons(cons),
						codes: getSelectedCodes()
					};

					initTimeline(filterData(data, filters), filters.year);
					drawDotmap(
						locdata.map(function(d) {
							return {
								agts: filterData(d.agts, filters),
								con: d.con,
								count: d.count,
								id: d.id
							};
						})
					);
				});
			})
			.catch(function(error) {
				throw error;
			});
	})
	.catch(function(error) {
		throw error;
	});
