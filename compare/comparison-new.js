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

// agtHeight defined in initialise function

// initialise timelines

// replace with calculated values
var minYear = parseDate('30/06/1989');
var maxYear = parseDate('30/06/2015');

var margin = {top: 25, right: 5, bottom: 5, left: 45},
	height = 880 - margin.top - margin.bottom,
	width = 400 - margin.left - margin.right,
	agtPadding = 2,
	agtSpacing = 1,
	agtWidth = 5;
	agtHeight = (height / (Number(formatYear(maxYear)) - Number(formatYear(minYear)))) - agtPadding;

// create time scale and y axis
var y = d3.scaleTime()
      .domain([minYear,maxYear])  // data space
      .range([margin.top,(height-margin.bottom)]);  // display space

var yAxis = d3.axisLeft(y)
		.tickFormat(d3.timeFormat("%Y"))
		.ticks(d3.timeYear.every(1))
		.tickPadding([5]);

// create svg and g
for (var i=0; i < nTimelines; i++) {

	var svg = d3.select('#timeline-v' + i)
		.append('svg')
		.attr('height', height + margin.top + margin.bottom)
		.attr('width', width + margin.left + margin.right)

	var g = svg.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		.attr('id', 'timeline-v' + i + '-g');

	var gY = g.append("g")
		.attr('transform', 'translate(-2, 0)')
		.attr("class","yaxis")
		.call(yAxis);
}


// Define the color scale for agreement stages
// (Colors from: http://colorbrewer2.org/#type=qualitative&scheme=Set3&n=7)
var stageColour = d3.scaleOrdinal()
	.domain(["Pre", "SubPar", "SubComp", "Imp", "Cea", "Ren", "Other"])
	.range(["#8dd3c7", "#ffffb3", "#fdb462", "#b3de69", "#fb8072","#bebada", "#8c8c8c"])

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

		populateDropdowns(nTimelines, data);



}) // end of .get(error,data)


function populateDropdowns(n, data) {
	
	// replace this with code to extract all countries from the data
	var selectCountries = getConNames(data);

	for (var i=0; i < n; i++) {

		// configure dropdowns to update timelines on change
		var dropdown  = d3.select('#timeline-v' + i + '-select')
			.data(selectCountries)
			.on("change", function() {
				// update timeline
				var country = this.value;
				console.log('update timeline: ', country)
				// get index of current div
				var index = this.id.match(/\d/g)[0] 
				updateTimeline(index, country)
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

function updateTimeline(index, country, data) {

	var filters = getFilters();

	// get current g
	var g = d3.select('#timeline-v' + index + '-g')

	

			window.conNames = getConNames(data)
			console.log(conNames)

			// filter for current country only
			data = data.filter(function(d) {
				return d.Con.indexOf(country) !== -1;})

			// remove previous rectangles (if any)
			g.selectAll('rect').remove()

			// Group agreements by Year (create an array of objects whose key is the year and value is an array of objects (one per agreement))
			var years = d3.nest()
				.key(function(d){ return d.Year; }).sortKeys(d3.ascending)
				.sortValues(function(a,b){ return d3.descending(a.Dat, b.Dat); })
				.entries(data);

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

			for (var i = 0; i < years.length; i++){
				
				var rects = g.selectAll("rect .y" + i)
					.data(years[i].values.filter(function(d) {
						return applyFilters(d, filters)
					}))
					.enter()
					.append("rect")
					.classed('y' + i, true)
					// .filter(function(d){ 
					// 	console.log(applyFilters(d, filters))
					// 	return applyFilters(d, filters) })
					// .attr("id",function(d){ return d.AgtId; })
					// .attr("name",function(d){ return d.Agt; })
					// .attr("value",function(d){ return d.Year; })
					.attr("fill", function(d){ 
						return (d.StageSub == 'FrCons' ? "#80b1d3" : stageColour(d.Stage));
					})
					.attr("x",function(d,i){ return (agtWidth + agtSpacing) * i })
					.attr("y", function(d){ return y(parseYear(d.Year)) - (agtHeight/2); })
					.attr("width", agtWidth)
					.attr("height", agtHeight);

				rects.on("click", function(d) {
					// show info on the left
					console.log('info to be shown on the left: ', d)
				});

				rects.on("mouseover",function(d){
					// style them to make clear they're being hovered
					// this.style.opacity = 1;
				});
				rects.on("mouseout",function(d) {
					// remove styling
					// remove infobox
				});
			} // end for loop (years)

			// chart header (country/entity name)
			g.append("text")
			.attr("x","5px")
			.attr("y", margin.top-15)
			.attr('font-weight', 'bold')
			.text(country);



	      /*
	      EXPORT PNG
	      from https://github.com/exupero/saveSvgAsPng
	      */
	      d3.select("#exportV").on("click", function(){
	        var title = "PA-X_VerticalTimeline";
	        var con = String(localStorage.getItem("paxVertConA"));
	        var codeFilters = [+paxHrFra, +paxPol, +paxEps, +paxMps, +paxPolps, +paxTerps, +paxTjMech, +paxGeWom];
	        var codeNames = ["HrFra", "Pol", "Eps", "Mps", "Polps", "Terps", "TjMech", "GeWom"];
	        var codes = "";
	        for (i = 0; i < codeFilters.length; i++){
	          if (codeFilters[i] > 0){
	            codes += codeNames[i];
	          }
	        }
	        title = title + "_" + con + "_" + codes + "_" + "01_01_1900-31_12_2015.png";
	        saveSvgAsPng(document.getElementsByTagName("svg")[0], title, {scale: 5, backgroundColor: "#737373"});
	        // if IE need canvg: canvg passed between scale & backgroundColor
	      });

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

// function applyFilters(d, filters) {

// 	// 'any' rule
// 	if (filters.any) {
// 		for (var i=0; i<codesLong.length; i++) {
// 			filters[codesLong[i]]
// 		}
// 		HrFra: 
// 		Mps: 
// 		Eps: 
// 		Terps: 
// 		Polps: 
// 		Pol: 
// 		GeWom: 
// 		TjMech: 
// 	}
// 	// 'all' rule
// 	else {

// 	}
	
// 	// TO BE IMPLEMENTED
// 	// applies the filters returned by getFilters() to a row of the data
// 	// returns true/false depending on whether data conforms to filter
// 	// console.log('filtering not yet implemented!')
// 	return true
// }

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