	// d3.select(window).on("resize", callFunction);
	// window.addEventListener("storage", toUpdate);

// js for the filters on the left

d3.select('#SelectAllCodesV')
	.on('click', function() {
		// check all checkboxes
		d3.selectAll('#CodeDropdown input').property('checked', true)
		d3.select('#selectionsCode').html(getSelectedCodes())
	})

d3.select('#DeselectAllCodesV')
	.on('click', function() {
		// uncheck all checkboxes
		d3.selectAll('#CodeDropdown input').property('checked', false)
		d3.select('#selectionsCode').html(getSelectedCodes())
	})

d3.selectAll('#CodeDropdown input')
	.on('change', function() {
		// update span with list of selected
		d3.select('#selectionsCode').html(getSelectedCodes())
	})

////////////////////////////////////////////////////////////////////////////////
// general def's

var codesLong = {HrFra: 'Human Rights Framework',
		Mps: 'Power Sharing: Military',
		Eps: 'Power Sharing: Economic',
		Terps: 'Power Sharing: Territorial',
		Polps: 'Power Sharing: Political',
		Pol: 'Political Institutions',
		GeWom: 'Women, Girls and Gender',
		TjMech: 'Transitional Justice Past Mechanism'}

var codes = Object.keys(codesLong)

// Date parsers & formatters
var parseDate = d3.timeParse("%d/%m/%Y");
var parseMonth = d3.timeParse("%m");
var parseYear = d3.timeParse("%Y");
var parseDay = d3.timeParse("%j");
var formatDate = d3.timeFormat("%d %B %Y");
var formatMonth = d3.timeFormat("%m");
var formatDay = d3.timeFormat("%j");  // day of the year as decimal number
var formatYear = d3.timeFormat("%Y");

////////////////////////////////////////////////////////////////////////////////
// set up svg

var nTimelines = 3 // there are 3 timelines (they all need to be defined in html)

// define margin and dimensions of svg
var margin = {top: 25, right: 5, bottom: 5, left: 45},
	height = 880 - margin.top - margin.bottom,
	width = 400 - margin.left - margin.right;

// define size and padding for agreement blocks
var agtPadding = 2,
	agtSpacing = 1,
	agtWidth = 5;
	// agtHeight defined based on data

// create svg and g for each timeline
for (var i=0; i < nTimelines; i++) {

	var svg = d3.select('#timeline-v' + i)
		.append('svg')
		.attr('height', height + margin.top + margin.bottom)
		.attr('width', width + margin.left + margin.right)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		.attr('id', 'timeline-v' + i + '-g');
}


// Define the color scale for agreement stages
// (Colors from: http://colorbrewer2.org/#type=qualitative&scheme=Set3&n=7)
var stageColour = d3.scaleOrdinal()
	.domain(['Cea', 'Pre', 'SubPar', 'SubComp', 'Imp', 'Ren', 'Other'])
	.range(["#fb8072", // red
		"#8dd3c7", // turquoise
		"#ffffb3", // yellow
		"#fdb462", // orange
		// Constitution -- blue
		"#b3de69", // green
		"#bebada", // purple
		"#8c8c8c"])// grey
var colourConstitution = "#80b1d3" // blue

////////////////////////////////////////////////////////////////////////////////
////////			  DATA  				////////
////////////////////////////////////////////////////////////////////////////////

d3.csv("../data/paxTimelineData_02092018.csv")
	.row(function(d){ return{ Year:+d.Year,
		Dat:parseDate(d.Dat),
		AgtId:+d.AgtId,
		// Reg:d.Reg,
		Con:d.Con,
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
		TjMech:+d.TjMech // 1-3 indicating increasing level of detail given about a body to deal with the past; 0 if none given
	}; })
	.get(function(error,data){

		console.log(data)

		var years = getYears(data)

		var minDate = parseDate('30/06/' + (years[0] - 1))
		var maxDate = parseDate('30/06/' + years[1])

		// create time scale and y axis
		var y = d3.scaleTime()
			.domain([minDate,maxDate])  // data space
			.range([margin.top,(height-margin.bottom)]);  // display space

		var yAxis = d3.axisLeft(y)
			.tickFormat(d3.timeFormat("%Y"))
			.ticks(d3.timeYear.every(1))
			.tickPadding([5]);

		// draw axis into each timeline svg
		for (var i=0; i < nTimelines; i++) {
			d3.select('#timeline-v' + i + '-g')
				.append("g")
				.attr('transform', 'translate(-2, 0)')
				.attr("class","yaxis")
				.call(yAxis);
		}

		populateDropdowns(nTimelines, data, y);

		d3.selectAll('#sidebar input')
			.on('change', function() {
				for (var i = 0; i < nTimelines; i++) {
					updateTimeline(i, data, y)				
				}
			})

}) // end of .get(error,data)


function populateDropdowns(nTimelines, data, yScale) {
	
	// extract all country/entity names from data and add to dropdowns
	var selectCountries = getConNames(data);

	for (var i=0; i < nTimelines; i++) {

		// configure dropdowns to update timelines on change
		var dropdown  = d3.select('#timeline-v' + i + '-select')
			.data(selectCountries)
			.on("change", function() {
				// update timeline
				// get index of current div
				var index = this.id.match(/\d/g)[0] 
				updateTimeline(index, data, yScale)
			})

		// add all countries/entities to dropdown
		dropdown.selectAll("option .new")
			.data(selectCountries)
			.enter()
			.append("option")
			.text(function(d) {return d})
			.attr("value", function(d) {return d})
	}
}

function updateTimeline(index, data, yScale) {

	// get country
	var country = d3.select('#timeline-v' + index + '-select')
		.property('value')

	// if no country is selected, don't do anything
	if (country == 0) { return; }

	// filter the data for the current country only
	var data_country = data.filter(function(d) {
		return d.Con.search(country) != -1
	})

	// get filters from inputs on the left
	var filters = getFilters();

	// apply filters
	var data_country = data_country.filter(function (d) {
		return applyFilters(d, filters)
	})

	// Group agreements by Year (create an array of objects whose key is the
	// year and value is an array of objects (one per agreement))
	var years = d3.nest()
		.key(function(d){ return d.Year; }).sortKeys(d3.ascending)
		.sortValues(function(a,b){ return d3.descending(a.Dat, b.Dat) })
		.entries(data_country);

	// get current g
	var g = d3.select('#timeline-v' + index + '-g');
	// console.log(g)

	// remove previous rectangles (if any)
	g.selectAll('rect').remove()

	// calculate height of agreement rect
	var yr = getYears(data);
	var agtHeight = (height / (1 + yr[1] - yr[0])) - agtPadding;
	console.log(agtHeight);
	// maybe implement later:

	// Find the maximum number of agreements in a single year for a single country/entity
	// var con_year_nest = d3.nest()
	// 	.key(function(d){ return d.Con; })
	// 	.key(function(d){ return d.Year; })
	// 	.rollup(function(leaves){ return leaves.length; })
	// 	.entries(data);
	// var maxAgts = 1;
	// for (c = 0; c < con_year_nest.length; c++){
	// 	var sub = con_year_nest[c].values;
	// 	// console.log(sub);
	// 	var agts = d3.max(sub, function(d){ return d.value; });
	// 	if (agts > maxAgts){
	// 		maxAgts = agts;
	// 	}
	// }
	// Set the agreement width (pixels) based on the maximum possible agts to display in a year
	// var agtWidth = (width-yWidth)/(maxAgts);
	console.log(years)

	for (var i = 0; i < years.length; i++) {
		console.log(years[i].values)
				
		var rects = g.selectAll("rect .y" + i)
			.data(years[i].values)
			.enter()
			.append("rect")
			.classed('y' + i, true)
			.attr("fill", function(d){ 
				return (d.StageSub == 'FrCons' ? colourConstitution : stageColour(d.Stage));
			})
			.attr("x",function(d,i){ return (agtWidth + agtSpacing) * i })
			.attr("y", function(d){ return yScale(parseYear(d.Year)) - (agtHeight/2); })
			.attr("width", agtWidth)
			.attr("height", agtHeight);

		rects.on("click", function(d) {
			// display infobox permanently (until click somewhere else in svg??)
			console.log('info to be shown on the left: ', d)
		});

		rects.on("mouseover",function(d){
			// display infobox
		});
		rects.on("mouseout",function(d) {
			// remove infobox
		});
	} // end for loop (years)

	// chart header (country/entity name)
	g.selectAll('.svg-header').remove()
	g.append('text')
		.classed('svg-header', true)
		.attr('x','5px')
		.attr('y', margin.top-15)
		.attr('font-weight', 'bold')
		.text(country);



	      /*
	      EXPORT PNG
	      from https://github.com/exupero/saveSvgAsPng
	      */
	      // d3.select("#exportV").on("click", function(){
	      //   var title = "PA-X_VerticalTimeline";
	      //   var con = String(localStorage.getItem("paxVertConA"));
	      //   var codeFilters = [+paxHrFra, +paxPol, +paxEps, +paxMps, +paxPolps, +paxTerps, +paxTjMech, +paxGeWom];
	      //   var codeNames = ["HrFra", "Pol", "Eps", "Mps", "Polps", "Terps", "TjMech", "GeWom"];
	      //   var codes = "";
	      //   for (i = 0; i < codeFilters.length; i++){
	      //     if (codeFilters[i] > 0){
	      //       codes += codeNames[i];
	      //     }
	      //   }
	      //   title = title + "_" + con + "_" + codes + "_" + "01_01_1900-31_12_2015.png";
	      //   saveSvgAsPng(document.getElementsByTagName("svg")[0], title, {scale: 5, backgroundColor: "#737373"});
	      //   // if IE need canvg: canvg passed between scale & backgroundColor
	      // });

} // end updateTimeline function


function getFilters(){

	// reads all filters and returns an object with their status

	var filters = {any: document.getElementById('anyV').checked, //otherwise ALL
		codes: []}

	for (var i=0; i<codes.length; i++) {

		if (document.getElementById('pax' + codes[i] + 'V').checked) {
			filters.codes.push(codes[i])
		}
	}
	return filters;
};

function applyFilters(dat, filters) {

	// if filters empty, everything passes the test
	if (filters.codes.length == 0) {
		return true
	}
	// otherwise we actually need to check
	else {
		// get an array of true/false for all filters
		var tf = []
		for (var i=0; i<filters.codes.length; i++) {
			tf.push(dat[filters.codes[i]] > 0)
		}
		console.log(tf)
		// for the ANY rule, it is enough if there is at least one true
		if (filters.any) { return tf.some(function(d) {return d}) }
		// for the ALL rule, everything in the array has to be true
		else { return tf.every(function(d) {return d}) }
	}
}

function getSelectedCodes() {
	// returns a string with the selected codes separated by commas

	var filters = getFilters().codes
	// var keys = Object.keys(codesLong)
	// var activeFilters = ''
	if (filters.length == codes.length) {
		return 'all'
	}
	else if (filters.length == 0) {
		return 'none'
	}
	else {
		var activeFilters = ''
		for (var i=0; i<filters.length; i++) {
			activeFilters += codesLong[filters[i]] + ', '
		}
		activeFilters = activeFilters.slice(0, -2)
		return activeFilters
	}	
}

function getConNames (dat) {
	// get all unique Con values
	var cons = d3.map(dat, function(d){return d.Con;}).keys()
	// split by '/' and flatten resulting array
	cons = cons.map(d => d.split('/'))
	cons = cons.reduce((acc, val) => acc.concat(val))
	// deal with a special case which has slashes in its name
	// "Rebolusyonaryong Partido ng Manggagawa-Pilipineas (RPMP/RPA/ABB)"
	while (cons.findIndex(element => element.search('(RPMP)$') != -1) != -1) {
		var i = cons.findIndex(element => element.search('(RPMP)$') != -1)
		cons[i] = [cons[i], cons[i+1], cons[i+2]].join('/')
		cons.splice(i+1, 2)
	}
	// remove brackets if they both open and close a string
	// this is so that names like 'Yugoslavia (former)' stay intact
	cons = cons.map(function(d) {
		// check if string starts with ( and ends with )
		if (d.search( '^[(].*[)]$' ) != -1) {
			// return the string minus the 1st and last character
			return d.substr(1,d.length-2)
		} 
		else { return d } // otherwise return the original string
	})
	// get the unique ones
	cons = [...new Set(cons)]
	// sort alphabetically
	cons = cons.sort()

	return cons

}

function getYears(data) {
	var minYear = d3.min(data.map(function(d) {return d.Year}))
	var maxYear = d3.max(data.map(function(d) {return d.Year}))
	return [minYear, maxYear]
}