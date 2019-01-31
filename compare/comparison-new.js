// js for the filters on the left

d3.select('#SelectAllCodesV')
	.on('click', function() {
		// check all checkboxes
		d3.selectAll('#CodeDropdown input').property('checked', true)
	})

d3.select('#DeselectAllCodesV')
	.on('click', function() {
		// check all checkboxes
		d3.selectAll('#CodeDropdown input').property('checked', false)
	})

d3.selectAll('#CodeDropdown input')
	.on('change', function() {
		// update span with list of selected
		// d3.select('#selectionsCode')
		console.log('supposed to be updating list of selected codes')
	})

////////////////////////////////////////////////////////////////////////////////
// general def's

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

// replace with calculated values
var minYear = parseYear('1989');
var maxYear = parseYear('2016');

var margin = {top: 15, right: 5, bottom: 5, left: 45}, //read clockwise from top
	// width = parseInt(d3.select("body").style("width"), 10),
	height = 880 - margin.top - margin.bottom,
	width = 400 - margin.left - margin.right,
	agtPadding = 2,
	agtSpacing = 1,
	agtWidth = 5;
var agtHeight = (height / (Number(formatYear(maxYear)) - Number(formatYear(minYear)))) - agtPadding;

// create svg
svg = d3.select('#timeline-v-a')
	.append('svg')
	.attr('height', height + margin.top + margin.bottom)
	.attr('width', width + margin.left + margin.right)

var g = svg.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


var y = d3.scaleTime()
      .domain([minYear,maxYear])  // data space
      .range([margin.top,(height-margin.bottom)]);  // display space

// draw y axis
var yAxis = d3.axisLeft(y).tickFormat(d3.timeFormat("%Y")).tickPadding([5]);

var gY = g.append("g")
	.attr('transform', 'translate(-2, 0)')
	.attr("class","yaxis")
// .attr("transform","translate(" + margin.left + "," + margin.top + ")")
.call(yAxis);

// Define the color scale for agreement stages
// (Colors from: http://colorbrewer2.org/#type=qualitative&scheme=Set3&n=7)
var stageColour = d3.scaleOrdinal()
	.domain(["Pre", "SubPar", "SubComp", "Imp", "Cea", "Other"])
	.range(["#8dd3c7", "#ffffb3", "#fdb462", "#b3de69", "#fb8072", "#8c8c8c"])

// replace this with code to extract all countries from the data
var selectCountries = ['Abkhazia', 'Aceh', 'Afghanistan'];

// configure dropdown to update timeline on change
var dropdown  = d3.select('#timeline-v-a select')
	.data(selectCountries)
	.on("change", function() {
		// update timeline
		var country = document.getElementById('timeline-v-a-select').value
		console.log('update timeline: ', country)
		updateTimeline(svg, country)
	})

// add all countries/entities to dropdown
dropdown.selectAll("option .new")
	.data(selectCountries)
	.enter()
	.append("option")
	.text(function(d) {return d})
	.attr("value", function(d) {return d})


function updateTimeline(svg, country) {

	// ?
	var selectionV;

	// d3.select(window).on("resize", callFunction);
	// window.addEventListener("storage", toUpdate);

	// function toUpdate(){
	//   if (window.localStorage.getItem("updatePaxVerticalA") == "true"){
	//     return callFunction();
	//   }
	// }

	// function callFunction() {
	  // console.log("Drawing left vertical timeline of yearly grouping");
	var filters = getFilters();
	console.log('filters:', filters)


	  // Obtain data
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

			// filter for current data
			data = data.filter(function(d) {
				return d.Con.indexOf(country) !== -1;})
			console.log(data)

			svg.selectAll('rect').remove()
			// var svgTest = d3.select("body").select("svg");
			// if (!svgTest.empty()) {
			//   svgTest.remove();
			// };

			// var paxVizData = [];

			// // Create bar chart tooltip
			// var tooltip = d3.select("body").append("div")
			//     .style("opacity","0")
			//     .style("position","absolute")
			//     .attr("class","tooltip");

			// Group agreements by Year (create an array of objects whose key is the year and value is an array of objects (one per agreement))
			var years = d3.nest()
				.key(function(d){ return d.Year; }).sortKeys(d3.ascending)
				.sortValues(function(a,b){ return d3.descending(a.Dat, b.Dat); })
				.entries(data);
			// var yrList = (d3.map(years, function(year){ return year.key; })).keys(); // array of year values
			
			console.log(years, years.length)
			// console.log(years); // an array of objects
			// console.log(years[0].values); // array of objects (one for each agreement in 1990)
			// console.log(years[0].values[0]); // first agreement object from 1990
			// console.log(years[0].values[0].Year); // Year (as number) of the first agreement object from 1990

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


			// Set up the x axis
			// var minYear = d3.min(data,function(d){ return parseYear(d.Year-1); });
			// var maxYear = d3.max(data,function(d){ return parseYear(d.Year+1); });

			// window.localStorage.setItem("paxMinYearV", minYear); // same for all vertical timelines
			// window.localStorage.setItem("paxMaxYearV", maxYear); // same for all vertical timelines

			// Define the full timeline chart SVG element
			// var svg = d3.select("body").select("#chartA").append("svg")
			// svg.attr("height", height + (margin.top*8) + margin.bottom)
			// .attr("width", width + margin.left + margin.right)
			// .attr("class","A");

	          

	          for (var i = 0; i < years.length; i++){
	          	console.log('draw rectangles for year ', i)
	            var g = svg.append("g")
	                        // .attr("class","chartGroup") //
	                        .attr("transform","translate("+margin.left+","+margin.top+")")

	            var rects = g.selectAll("rect")
	                .data(years[i].values)
	              .enter().append("rect")
	              // .filter(function(d){ return pickAgtCon(d); })
	              // need to put filter back in here
	              // .filter(function(d){ return setVertAgtFilters(d); })
	                .attr("class","agt")
	                .attr("id",function(d){ return d.AgtId; })
	                .attr("name",function(d){ return d.Agt; })
	                .attr("value",function(d){ return d.Year; })
	                .attr("fill", function(d){ 
	                	return (d.StageSub == 'FrCons' ? "#80b1d3" : stageColour(d.Stage));                	; 
	                })
	                // .attr("stroke",function(d){ if (+d.AgtId == +selectionV[0]){ return "#ffffff"; } else { return "#737373"; } })  // same as html background-color
	                // .attr("stroke-width","1px")
	                // .style("opacity", function(d){ if (+d.AgtId == +selectionV[0]){ return "1"; } else { return "0.7"; } })
	                .attr("x",function(d,i){ return (agtWidth + agtSpacing) * i })
	                .attr("y", function(d){ return y(parseYear(d.Year)) - (agtHeight/2); })
	                .attr("width", agtWidth)
	                .attr("height", agtHeight);

	            rects.on("click", function(d) {
	              if (+d.AgtId != +selectionV[0]){
	                paxVizData = [d.AgtId,d.Agt,formatDate(d.Dat),d.Con,d.Status,d.Agtp,d.Stage,d.StageSub,d.Pol,d.Polps,d.Terps,d.Eps,d.Mps,d.HrFra,d.GeWom,d.TjMech];
	                // window.localStorage.setItem("paxselectionV", JSON.stringify(paxVizData));
	                // window.localStorage.setItem("updatePaxVerticalB", "true"); // Deselect any selected agreement on middle vertical timeline
	                // window.localStorage.setItem("updatePaxVerticalC", "true"); // Deselect any selected agreement on right vertical timeline
	                callFunction();
	              } else { // if clicked
	                // console.log(this.id);
	                // window.localStorage.setItem("paxselectionV", JSON.stringify([]));
	                // window.localStorage.setItem("updatePaxVerticalB", "true"); // Deselect any selected agreement on middle vertical timeline
	                // window.localStorage.setItem("updatePaxVerticalC", "true"); // Deselect any selected agreement on right vertical timeline
	                callFunction();
	              }
	            });

	            rects.on("mouseover",function(d){
	                this.style.opacity = 1;
	                paxVizData = [d.AgtId,d.Agt,formatDate(d.Dat),d.Con,d.Status,d.Agtp,d.Stage,d.StageSub,d.Pol,d.Polps,d.Terps,d.Eps,d.Mps,d.HrFra,d.GeWom,d.TjMech];
	                window.localStorage.setItem("paxhoverV", JSON.stringify(paxVizData));
	            });
	            rects.on("mouseout",function(d) {
	              window.localStorage.setItem("paxhoverV", JSON.stringify([]));
	              if (+d.AgtId.id != +selectionV[0]){
	                this.style.opacity = 0.7;
	                this.style.fill = getStageFill(d, stageValues, stageColors);
	               }
	            });

	          }

	          /*
	          TIMELINE DESCRIPTION
	          */
	          g.append("text")
	                      .attr("x","0px")
	                      .attr("y", margin.top-10)
	                      .attr("class","description")
	                      .text(country);
	          // chartGroup.append("text")
	          //             .attr("x", "0px")
	          //             .attr("y", margin.top*5)
	          //             .attr("class","description")
	          //             .text("Selected Codes: "+String(getCodeCount()));

		

	          /*
	          FUNCTIONS
	          */
	          // function getCodeCount(){
	          //   var codeFilters = [+paxHrFra, +paxHrFra, +paxPol, +paxEps, +paxMps, +paxPolps, +paxTerps, +paxTjMech, +paxGeWom];
	          //   var codeFilterCount = codeFilters.length;
	          //   var codeText = 0;
	          //   for (i = 0; i < codeFilterCount; i++){
	          //     if (codeFilters[i] > 0){ codeText += 1; }
	          //   } return codeText;
	          // }

	          // function pickAgtCon(d){
	          //   var con = String(localStorage.getItem("paxVertConA"));
	          //   var agmtCon = String(d.Con);
	          //   if ((agmtCon.includes(con)) || (con.includes(agmtCon))){
	          //    return d;
	          //   }
	          // }

	          function setVertAgtFilters(d){
	            var agmtCodes = [d.GeWom, d.HrFra, d.Eps, d.Mps, d.Pol, d.Polps, d.Terps, d.TjMech]; //d.HrFra,
	            var codeFilters = [+paxGeWom, +paxHrFra, +paxEps, +paxMps, +paxPol, +paxPolps, +paxTerps, +paxTjMech]; //+paxHrFra,
	            var codeFilterCount = codeFilters.length;
	            if (paxANY == 1){
	             for (i = 0; i < codeFilterCount; i++){
	               if ((+codeFilters[i] == 1) && (+agmtCodes[i] > 0)){
	                 return d;
	               }
	             }
	            } else { // if paxALL == 1
	             var mismatch = false;
	             for (j = 0; j < codeFilterCount; j++){
	               if ((+codeFilters[j] == 1) && (+agmtCodes[j] == 0)){
	                 mismatch = true;
	               }
	             }
	             if (!mismatch){
	               return d;
	             }
	            }
	          }

	          function getStageFill(d, stageValues, stageColors){
	            // d.StageSub value to color: "FrCons"
	            // d.Stage possible values to color: "Pre", "SubPar", "SubComp", "Imp", "Cea", "Other"
	            if (+d.AgtId == +selectionV[0]){
	              return "#ffffff";
	            } else if (d.StageSub == stageValues[6]){ //"FrCons"
	             return stageColors[6];
	            } else {
	             var stageI = stageValues.indexOf(d.Stage);
	             if (stageI != -1){
	               return stageColors[stageI];
	             } else {
	               return "#bebada";//"black";
	             }
	            }
	          }

	      }) // end of .get(error,data)

	      window.localStorage.setItem("updatePaxVerticalA", "false");

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

	  }; // end of callFunction()

function getFilters(){
	// var locStor = window.localStorage;
	// Filter rule

	var filters = {any: document.getElementById('anyV').checked, //otherwise ALL
		HrFra: document.getElementById('paxHrFraV').checked,
		Mps: document.getElementById('paxMpsV').checked,
		Eps: document.getElementById('paxEpsV').checked,
		Terps: document.getElementById('paxTerpsV').checked,
		Polps: document.getElementById('paxPolpsV').checked,
		Pol: document.getElementById('paxPolV').checked,
		GeWom: document.getElementById('paxGeWomV').checked,
		TjMech: document.getElementById('paxTjMechV').checked}

	return filters;

	// paxRule = locStor.getItem("paxRule");
	// paxANY = document.getElementById('anyV').checked
	// paxALL = document.getElementById('allV').checked
	// Filter codes

	// paxHrFra = document.getElementById('paxHrFraV').checked
	// paxMps = document.getElementById('paxMpsV').checked
	// paxEps = document.getElementById('paxEpsV').checked
	// paxTerps = document.getElementById('paxTerpsV').checked
	// paxPolps = document.getElementById('paxPolpsV').checked
	// paxPol = document.getElementById('paxPolV').checked
	// paxGeWom = document.getElementById('paxGeWomV').checked
	// paxTjMech = document.getElementById('paxTjMechV').checked


	// Agreement selection
	// selectionV = JSON.parse(window.localStorage.getItem("paxselectionV"));
	// console.log("Vertical Selection: "+selectionV);
};