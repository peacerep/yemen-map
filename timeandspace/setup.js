"use strict";

// Set up filters

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

// Load data
d3.csv("../data/pa-x.csv", parseData)
	.then(function(data) {
		console.log(data);
		// Set up year slider
		var years = getYears(data);
		var myslider = slider("timeslider", years[0], years[1]);

		// Add countries/entities to dropdown
		var cons = getConNames(data);
		d3.select("#conDropdown")
			.selectAll("span")
			.data(cons)
			.enter()
			.append("span")
			.html(function(d, i) {
				return (
					"<label><input type='checkbox' id='checkboxCon" +
					i +
					"' name='Con' class='input'>" +
					d +
					"</label><br/>"
				);
			});

		// Update list of selected countries on change
		d3.select("#conDropdown").on("click", function() {
			// update span with list of selected
			d3.select("#selectedCons").html(getSelectedConsString(cons));
		});

		// Initialise reset button for filters
		d3.select("#reset-filters").on("click", resetFilters);
		resetFilters();

		// Draw timeline
		initTimeline(data, years);

		// Load geojson world map
		d3.json("../data/world-110m-custom.geojson")
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
					.classed("land", true)
					.on("mouseover", function(d) {
						mouseoverCountry(this, d);
					})
					.on("mouseout", function(d) {
						mouseoutCountry(this, d);
					})
					.on("click", function(d) {
						var filters = {
							year: myslider.getRange(),
							cons: getSelectedCons(cons),
							codes: getSelectedCodes()
						};
						clickCountry(
							d.properties.name,
							filterData(
								locdata[locdata.findIndex(e => e.con == d.properties.name)]
									.agts,
								filters
							),
							world
						);
					});

				// Match data points with locations on the map and draw dot map
				const locdata = makeDotmapData(data, world);
				drawDotmap(locdata);

				// Listen for changes in filters
				d3.selectAll(".input").on("change", function() {
					var filters = {
						year: myslider.getRange(),
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

		// Function to reset filters and visualisation
		function resetFilters() {
			console.log("resetting filters");

			// Time
			myslider.resetBrush();

			// Countries/Entities
			d3.select("#anyCon").property("checked", true);
			d3.selectAll("#conDropdown input").property("checked", false);

			// Codes
			d3.select("#anyCodes").property("checked", true);
			d3.selectAll("#codesCheckboxes input").property("checked", false);

			let event = new Event("change");
			eventHandler.dispatchEvent(event);
		}
	})
	.catch(function(error) {
		throw error;
	});

// Functions

function getSelectedCons(cons) {
	// reads the con checkboxes and returns an object with their status
	var filters = {
		any: document.getElementById("anyCon").checked, //otherwise ALL
		cons: []
	};

	for (var i = 0; i < cons.length; i++) {
		if (document.getElementById("checkboxCon" + i).checked) {
			filters.cons.push(cons[i]);
		}
	}
	return filters;
}

function getSelectedConsString(cons) {
	// check which countries are selected in the dropdown and returns a string
	// with all those countries separated by commas
	var selected = getSelectedCons(cons);

	if (selected.length == cons.length) {
		return "All";
	} else if (selected.length == 0) {
		return "None";
	} else {
		var str = "";
		for (var i = 0; i < selected.length; i++) {
			str += selected[i] + ", ";
		}
		str = str.slice(0, -2);
		return str;
	}
}

// Selecting and mousing over agreements
var selectedAgt = new function() {
	var agt = null;

	this.clickOn = function(d) {
		// if it's the same that's already selected
		if (agt != null && agt.id === d.id) {
			this.clear();
			return;
		}

		// else it's new
		else {
			// if there's an old one, get rid of it
			if (agt) {
				this.clear();
			}

			//highlight new one
			agt = d;

			// display infobox
			agtDetails(agt);

			// highlight the glyph (if it exists)
			d3.select("#glyph" + agt.id).classed("selected", true);

			// highlight the timeline item
			d3.select("#rect" + agt.id).style("fill", "#9ed3ff");
		}
	};

	this.get = function() {
		return agt;
	};

	this.clear = function() {
		// remove all highlights and reset agt
		if (agt) {
			// remove glyph highlight
			d3.select("#glyph" + agt.id).classed("selected", false);

			// remove timeline highlight
			d3.select("#rect" + agt.id).style("fill", null);
		}

		// reset agt
		agt = null;
		agtDetails(null);
	};
}();

function onmouseover(d) {
	// only run if this is not the selected event or there is no selected event
	if (selectedAgt.get() === null || !(d.id == selectedAgt.get().id)) {
		// show info box
		agtDetails(d);
		// hover effects on glyph + timeline
		d3.select("#glyph" + d.id).classed("hover", true);
		d3.select("#rect" + d.id).classed("hover", true);
	}
}

function onmouseout(d) {
	// remove hover effects on glyph + timeline
	d3.select("#glyph" + d.id).classed("hover", false);
	d3.select("#rect" + d.id).classed("hover", false);

	// only run if this is not the selected event or there is no selected event
	if (selectedAgt.get() === null || !(d.id == selectedAgt.get().id)) {
		// reset info box to selected agreement
		agtDetails(selectedAgt.get());
	}
}
