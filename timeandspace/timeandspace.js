"use strict";

////////////////////////////////////////////////////////////////////////////////
//////////////////////////// SET UP FILTERS ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

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

// add codes checkboxes
makeCodesCheckboxes(true);

// initialise infobox
agtDetails(null);

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// DATA //////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

d3.csv("../data/paxTimelineData_02092018.csv", function(d) {
	// preprocess rows
	return {
		Year: +d.Year,
		Dat: parseDate(d.Dat),
		AgtId: +d.AgtId,
		// Reg:d.Reg,
		Con: splitConNames(d.Con),
		Status: d.Status,
		Agtp: d.Agtp,
		Stage: d.Stage, // "Pre", "SubPar", "SubComp", "Imp", "Cea", "Other"
		StageSub: d.StageSub, // "FrCons"
		Agt: d.Agt,
		GeWom: +d.GeWom, // 1 if topic of Women, girls and gender addressed; 0 if not
		Polps: +d.Polps, // 1-3 indicating increasing level of detail given about Political Power sharing; 0 if none given
		Terps: +d.Terps, // 1-3 indicating increasing level of detail given about Territorial Power sharing; 0 if none given
		Eps: +d.Eps, // 1-3 indicating increasing level of detail given about Economic Power sharing; 0 if none given
		Mps: +d.Mps, // 1-3 indicating increasing level of detail given about Political Power sharing; 0 if none given
		Pol: +d.Pol, // 1-3 indicating increasing level of detail given about political institutions; 0 if none given
		HrFra: +d.HrFra, // 1 if topic of human rights/rule of law addressed; 0 if not
		// HrFra:+d.HrFra, // 1-3 indicating increasing level of detail given about human rights framework to be established; 0 if none given
		TjMech: +d.TjMech
	}; // 1-3 indicating increasing level of detail given about a body to deal with the past; 0 if none given
})
	.then(function(data) {
		// INITIAL SETUP
		// setup year slider
		var years = getYears(data);
		var myslider = slider("timeslider", years[0], years[1]);

		// add countries/entities to dropdown
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

		// update list of selected countries on change
		d3.select("#conDropdown").on("click", function() {
			// update span with list of selected
			d3.select("#selectedCons").html(getSelectedConsString(cons));
		});

		d3.select("#reset-filters").on("click", resetFilters);
		resetFilters();

		// draw timeline
		initTimeline(data, years);

		// d3.selectAll('.chartType input').on('change', function() {
		// 	initTimeline(data, years, this.value)})

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
						return d.id;
					})
					.attr("d", path)
					.classed("land", true);

				// match data points with locations on the map
				const locdata = combineDataPoly(data, world);

				// draw glyphs
				updateGlyphs(locdata);

				// UPDATING
				// Listen for changes in filters
				d3.selectAll(".input, #eventHandler").on("change", function() {
					var filters = {
						year: myslider.getRange(),
						cons: getSelectedCons(cons),
						codes: getSelectedCodes()
					};

					initTimeline(filterData(data, filters), filters.year);
					updateGlyphs(filterData(locdata, filters));
				});
			})
			.catch(function(error) {
				throw error;
			});

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

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// FUNCTIONS /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////
// selecting and mousing over agreements
////////////////////////////////////////////////////////////////////////////////

var selectedAgt = new function() {
	var agt = null;

	this.clickOn = function(d) {
		// if it's the same that's already selected
		if (agt == d) {
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

			// highlight the flower
			var glyph = d3.select("#glyph" + agt.AgtId);
			glyph
				.select("circle")
				.attr("r", 17)
				.style("fill", "#fff")
				.style("fill-opacity", 0.9)
				.style("stroke", "black")
				.style("stroke-width", 0.5)
				.transition();

			// highlight the timeline item
			d3.select("#rect" + agt.AgtId)
				.attr("transform", "translate(0,-1)")
				.attr("height", 3)
				.style("fill", "#4682b4")
				.transition();
		}
	};

	this.get = function() {
		return agt;
	};

	this.clear = function() {
		// remove all highlights and reset agt

		if (agt) {
			// remove glyph highlight
			d3.select("#glyph" + agt.AgtId)
				.select("circle")
				.attr("r", rCircle)
				.style("fill", fillCircle)
				.style("fill-opacity", 1)
				.style("stroke", "none")
				.transition();

			d3.select("#glyph" + agt.AgtId).attr("transform", function(d) {
				var t = parseTransform(d3.select(this).attr("transform"));
				return `translate(${t.translate}) scale(1)`;
			});

			// remove timeline highlight
			d3.select("#rect" + agt.AgtId)
				.attr("transform", "")
				.attr("height", 1)
				.style("fill", "#000")
				.transition();
		}

		// reset agt
		agt = null;
		agtDetails(null);
	};
}();

function onmouseover(d) {
	// only run if this is not the selected event or there is no selected event
	if (selectedAgt.get() === null || !(d.AgtId == selectedAgt.get().AgtId)) {
		agtDetails(d);
		var glyph = d3.select("#glyph" + d.AgtId);
		glyph.moveToFront();
		glyph
			.select("circle")
			.attr("r", 17)
			.style("fill", "#fff")
			.style("fill-opacity", 0.9);

		// scale 200%
		glyph.attr("transform", function(d) {
			var t = parseTransform(d3.select(this).attr("transform"));
			return `translate(${t.translate}) scale(2)`;
		});
		d3.select("#rect" + d.AgtId)
			.style("fill", "#ccc")
			.transition();
	}
}

function onmouseout(d) {
	// only run if this is not the selected event or there is no selected event
	if (selectedAgt.get() === null || !(d.AgtId == selectedAgt.get().AgtId)) {
		// remove infobox
		agtDetails(selectedAgt.get());

		var glyph = d3.select("#glyph" + d.AgtId);
		glyph
			.select("circle")
			.attr("r", rCircle)
			.style("fill", fillCircle)
			.style("fill-opacity", 1)
			.transition();

		// reset scale
		glyph.attr("transform", function(d) {
			var t = parseTransform(d3.select(this).attr("transform"));
			return `translate(${t.translate}) scale(1)`;
		});
		d3.select("#rect" + d.AgtId)
			.style("fill", "#000")
			.transition();
	}
}
