"use strict"

////////////////////////////////////////////////////////////////////////////////
//////////////////////////// SET UP FILTERS ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

d3.select('#selectAllCodes')
	.on('click', function() {
		// check all checkboxes
		d3.selectAll('#codesCheckboxes input').property('checked', true)
	})

d3.select('#deselectAllCodes')
	.on('click', function() {
		// uncheck all checkboxes
		d3.selectAll('#codesCheckboxes input').property('checked', false)
	})

d3.select('#selectAllCons')
	.on('click', function() {
		// check all checkboxes
		d3.selectAll('#conDropdown input').property('checked', true)
	})

d3.select('#deselectAllCons')
	.on('click', function() {
		// uncheck all checkboxes
		d3.selectAll('#conDropdown input').property('checked', false)
	})

var selectedAgtDetails = null;
// add something to deselect

// initialise infobox
agtDetails(null)

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// DATA //////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

d3.csv("../data/paxTimelineData_02092018.csv", function(d) {
	// preprocess rows
	return {Year:+d.Year,
		Dat:parseDate(d.Dat),
		AgtId:+d.AgtId,
		// Reg:d.Reg,
		Con:splitConNames(d.Con),
		Status:d.Status,
		Agtp:d.Agtp,
		Stage:d.Stage, // "Pre", "SubPar", "SubComp", "Imp", "Cea", "Other"
		StageSub:d.StageSub, // "FrCons"
		Agt:d.Agt,
		GeWom:+d.GeWom, // 1 if topic of Women, girls and gender addressed; 0 if not
		Polps:+d.Polps, // 1-3 indicating increasing level of detail given about Political Power sharing; 0 if none given
		Terps:+d.Terps, // 1-3 indicating increasing level of detail given about Territorial Power sharing; 0 if none given
		Eps:+d.Eps, // 1-3 indicating increasing level of detail given about Economic Power sharing; 0 if none given
		Mps:+d.Mps, // 1-3 indicating increasing level of detail given about Political Power sharing; 0 if none given
		Pol:+d.Pol, // 1-3 indicating increasing level of detail given about political institutions; 0 if none given
		HrFra:+d.HrFra, // 1 if topic of human rights/rule of law addressed; 0 if not
		// HrFra:+d.HrFra, // 1-3 indicating increasing level of detail given about human rights framework to be established; 0 if none given
		TjMech:+d.TjMech} // 1-3 indicating increasing level of detail given about a body to deal with the past; 0 if none given
}).then(function(data) {

	// INITIAL SETUP
	// add years to year dropdowns
	var years = getYears(data)
	populateYearDropdowns(years)

	// add countries/entities to dropdown
	var cons = getConNames(data)
	d3.select('#conDropdown')
		.selectAll('span')
		.data(cons)
		.enter()
		.append('span')
		.html(function(d,i) {
			return "<label><input type='checkbox' id='con" + i +
			"' name='Con'>"+ d + "</label><br/>"
		})

	// update list of selected countries on change
	d3.select('#conDropdown')
		.on('click', function() {
			// update span with list of selected
			d3.select('#selectedCons').html(getSelectedConsString(cons))
		})

	// draw timeline
	initTimeline(data)

	d3.json("../data/world-110m.geojson").then(function(world) {
	d3.csv('../data/country_centroids.csv').then(function(centroids) {
		mapG.append('g')
			.selectAll("path")
			.data(world.features)
			.enter()
			.append('path')
			.attr('id', function(d) {return d.id})
			.attr('d', path)
			.classed('land', true)

		var locdata = combineDataLoc(data, centroids)

		// prepare for circle packing
		for (var i=0; i < locdata.length; i++) {
			d3.packSiblings(locdata[i].agts
						.map(function(d) {
							d.r = 3;
							return d
						}))
			locdata[i].outercircle = d3.packEnclose(locdata[i].agts)
		}

		// initialise zoom
		var zoom = d3.zoom()
			.scaleExtent([1,10])
			.on("start", zoomStart)
			.on("zoom", zooming)
			.on("end", zoomEnd)

		svg.call(zoom)

		function zoomStart() {
			dotG.classed("hidden", true)
		}

		function zooming() {
			// keep stroke-width constant at different zoom levels
			mapG.style("stroke-width", 1 / d3.event.transform.k + "px");
			// zoom map
			mapG.attr("transform", d3.event.transform);
			// dotG.attr("transform", d3.event.transform);
		}

		function zoomEnd() {
			// update projection
			projection
			.translate([d3.event.transform.x + d3.event.transform.k*transInit[0], d3.event.transform.y + d3.event.transform.k*transInit[1]])
			.scale(d3.event.transform.k * scaleInit)
			// drawFlowers(collection)
			dotG.classed("hidden", false)

			// re-plot dots
			updateGlyphs(locdata)
		}
		
		// initial display
		updateGlyphs(locdata)
	
	}).catch(function(error){
		throw error;
	})
	}).catch(function(error){
		throw error;
	})


}).catch(function(error){
	throw error;
})

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// FUNCTIONS /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function populateYearDropdowns(years) {
	// populates the start and end year dropdowns with all years in between
	// and including the years given in the input 'years'
	// years is an array like so: [minyear, maxyear]

	var minYear = years[0]
	var maxYear = years[1]
	var lst = d3.range(minYear, maxYear+1)

	d3.select('#inputMinYear')
		.selectAll('option .new')
		.data(lst)
		.enter()
		.append('option')
		.text(function(d) {return d})
		.attr('value', function(d) {return d})

	d3.select('#inputMaxYear')
		.selectAll('option .new')
		.data(lst)
		.enter()
		.append('option')
		.text(function(d) {return d})
		.attr('value', function(d) {return d})
}

function getSelectedCons(conlist) {
	// checks which countries are selected in the dropdown and returns an
	// array containing the names of those countries
	var check = []
	for (var i = 0; i < conlist.length; i++) {
		if (document.getElementById('con' + i).checked) {
			check.push(conlist[i])
		}
	}
	return check
}

function getSelectedConsString(conlist) {
	// check which countries are selected in the dropdown and returns a string
	// with all those countries separated by commas
	var selected = getSelectedCons(conlist)

	if (selected.length == conlist.length) {
		return 'All'
	}
	else if (selected.length == 0) {
		return 'None'
	}
	else {
		var str = ''
		for (var i = 0; i < selected.length; i++) {
			str += selected[i] + ', '
		}
		str = str.slice(0, -2)
		return str
	}
}


// to update agreement details!
// rects.on("click", function(d) {
// 	// display infobox permanently (until click somewhere else in svg??)
// 	if (selectedAgtDetails == d) {
// 		selectedAgtDetails = null
// 	} else {
// 		selectedAgtDetails = d;
// 	}
// 	agtDetails(d)
// 	event.stopPropagation();
// });

// rects.on("mouseover",function(d){
// 	// display infobox
// 	agtDetails(d)
// });
// rects.on("mouseout",function(d) {
// 	// remove infobox
// 	agtDetails(selectedAgtDetails)
// });