/*
LINE GRAPH Visualizing the Proportion of Agreements that Address Selected Codes
for Selected Countries/Entities each Year
*/

// Define one key/value pair per category (code) by which to filter which
// agreements the timeline and map visualize, checking all paxfilters
// (value = 1) upon page load so all agreements are visible
var paxHrFra = window.localStorage.setItem("paxHrFra",0); // Human rights framework
var paxHrGen = window.localStorage.setItem("paxHrGen",0);; // Human rights/Rule of law
var paxMps = window.localStorage.setItem("paxPol",0); // Military power sharing
var paxEps = window.localStorage.setItem("paxEps",0); // Economic power sharing
var paxTerps = window.localStorage.setItem("paxMps",0); // Territorial power sharing
var paxPolps = window.localStorage.setItem("paxPolps",0); // Political power sharing
var paxPol = window.localStorage.setItem("paxTerps",0); // Political institutions
var paxGeWom = window.localStorage.setItem("paxTjMech",0); // Women, girls and gender
var paxTjMech = window.localStorage.setItem("paxGeWom",0); // Transitional justice past mechanism

var paxANY = window.localStorage.setItem("paxANY",0); // ANY filter rule
var paxALL = window.localStorage.setItem("paxALL",1); // ALL filter rule (selected by default)

window.localStorage.setItem("paxConRule","all"); // Country/entity rule (ALL by default)

var parseYear = d3.timeParse("%Y");
var formatYear = d3.timeFormat("%Y");

var margin = {top: 5, right: 65, bottom: 5, left: 5}, //read clockwise from top
    width = parseInt(d3.select("body").style("width"), 10),
    width = width - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom,
    agtHeight = 2,
    xHeight = 10,
    agtPadding = 2,
    agtSpacing = 1;

// Get all peace agreements data
d3.csv("PAX_with_additional.csv", function(csv){
  data = csv;
  // Exclude data for unchecked countries/entities
  var filtered = data.filter(function(d){ return setAgtCons(d); })
  var nested = nestData(filtered);
  // console.log(nested);

  // Set up the graph's axes
  var minYear = d3.min(data,function(d){ return parseYear(d.Year-1); });
  console.log(minYear);
  var maxYear = d3.max(data,function(d){ return parseYear(d.Year+1); });
  var x = d3.scaleTime()
              .domain([minYear,maxYear])  // data space
              .range([margin.left,width]);  // display space
  var y = d3.scaleLinear()
              .domain([0, 1]) // tick format converts proportions to %
              .range([height-xHeight,0]);
  // Define the line to graph
  var valueline = d3.line()
        .x(function(d,i){ return x(parseYear(d[0])); })
        .y(function(d,i){ return y(d[1]); });
  // Define the full timeline chart SVG element
  var svg = d3.select("body").select("#chart").append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right);
  // var chartGroup = svg.append("g")
  //             .attr("class","chartGroup") //
  //             .attr("transform","translate("+margin.left+","+margin.top+")")

  // Get code data
  d3.csv("data/PAX_GeWom.csv", function(csv_GeWom){
    data = csv_GeWom;
    var nested_GeWom = nestData(data.filter(function(d){ return setAgtCons(d); }));
    var yrList = (d3.map(nested_GeWom, function(d){ return d.key; })).keys(); // array of year values
    // console.log(nested_GeWom);
    // Calculate the proportions data
    var propData = [];
    for (i = 0; i < nested.length; i++){
      var totalCount = nested[i].value;
      var codeCount = nested_GeWom[i].value;
      var year = String(nested[i].key);
      propData.push(+codeCount/+totalCount);
    }
    // console.log(propData);
    var lineData = yrList.map(function(y,i){ return [y, propData[i]]; });
    console.log(lineData);
    // Graph the proportions data
    svg.append("path")
    .data([lineData])
    .attr("class","line")
    .attr("d",valueline);

  });

  // Draw the axes
  var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%e %b %Y")).tickPadding([5]);
  var gX = svg.append("g")
       .attr("class","xaxis")
       .attr("transform","translate("+(margin.left*7)+","+(height-margin.top)+")")
       .call(xAxis);
  var yAxis = d3.axisLeft(y).tickFormat(d3.format(".0%")).ticks(5);
  var gY = svg.append("g")
        .attr("class", "yaxis")
        .attr("transform","translate("+(margin.left*8)+","+(margin.top)+")")
        .call(yAxis);

});

function nestData(data_to_nest){
  var nested = d3.nest()
                .key(function(d){ return d.Year; }).sortKeys(d3.ascending)
                .rollup(function(leaves){ return leaves.length; })
                .entries(data_to_nest);
  return nested;
}

function setAgtCons(d){
  var paxCons = JSON.parse(window.localStorage.getItem("paxCons")); // Country/entity list (includes all upon load)
  var paxConRule = localStorage.getItem("paxConRule");
  var agmtCon = String(d.Con);
  if (paxConRule == "any"){
    if (paxCons.length > 0){
      for (i = 0; i < paxCons.length; i++){
        // if (!(agmtCon.includes(paxCons[i]))){
        //   console.log(agmtCon);
        // }
        if (agmtCon.includes(paxCons[i])){
          return d;
        }
      }
    }
  }
  if (paxConRule == "all") {
    var mismatch = false;
    for (j = 0; j < paxCons.length; j++){
      if (!(agmtCon.includes(paxCons[j]))){
        mismatch = true;
        // console.log("Mismatched: "+agmtCon);
      }
    }
    if (!mismatch){
      return d;
    }
  }
}
function setAgtFilters(d){
  getFilters();
  var agmtCodes = [d.GeWom, d.HrFra, d.HrGen, d.Eps, d.Mps, d.Pol, d.Polps, d.Terps, d.TjMech];
  var codeFilters = [+paxGeWom, +paxHrFra, +paxHrGen, +paxEps, +paxMps, +paxPol, +paxPolps, +paxTerps, +paxTjMech];
  var codeFilterCount = codeFilters.length;
  if (paxANY == 1){
    for (i = 0; i < codeFilterCount; i++){
      if ((codeFilters[i] == 1) && (agmtCodes[i] > 0)){
        return d;
      }
    }
  } else { // if paxALL == 1
    var mismatch = false;
    for (j = 0; j < codeFilterCount; j++){
      if ((codeFilters[j] == 1) && agmtCodes[j] == 0){
        mismatch = true;
      }
    }
    if (!mismatch){
      return d;
    }
  }
}

function getFilters(){
  var locStor = window.localStorage;
  // Filter rule
  // paxRule = locStor.getItem("paxRule");
  paxANY = locStor.getItem("paxANY");
  paxALL = locStor.getItem("paxALL");
  // Filter codes
  paxHrFra = locStor.getItem("paxHrFra");
  paxHrGen = locStor.getItem("paxHrGen");
  paxMps = locStor.getItem("paxMps");
  paxEps = locStor.getItem("paxEps");
  paxTerps = locStor.getItem("paxTerps");
  paxPolps = locStor.getItem("paxPolps");
  paxPol = locStor.getItem("paxPol");
  paxGeWom = locStor.getItem("paxGeWom");
  paxTjMech = locStor.getItem("paxTjMech");
};

// d3.select(window).on("resize", callFunction);
// window.addEventListener("storage", callFunction);
//
//
// function callFunction() {
//   console.log("Drawing visualization of proportions");
//
//   getFilters();
//
//   // Agreement information to display upon hover
//   var agt = "Hover over an agreement to view its details.",
//       dat = "",
//       reg = "",
//       con = "",
//       status = "",
//       agtp = "",
//       stage = "";
//   window.localStorage.setItem("paxagt", agt);
//   window.localStorage.setItem("paxdat", dat);
//   window.localStorage.setItem("paxreg", reg);
//   window.localStorage.setItem("paxcon", con);
//   window.localStorage.setItem("paxstatus", status);
//   window.localStorage.setItem("paxagtp", agtp);
//   window.localStorage.setItem("paxstage", stage);
//
//   // Date parsers & formatters
//   var parseDate = d3.timeParse("%d/%m/%Y");
//   var parseMonth = d3.timeParse("%m");
//   var parseYear = d3.timeParse("%Y");
//   var parseDay = d3.timeParse("%j");
//   var formatDate = d3.timeFormat("%d %B %Y");
//   var formatMonth = d3.timeFormat("%m");
//   var formatDay = d3.timeFormat("%j");  // day of the year as decimal number
//   var formatYear = d3.timeFormat("%Y");
//
//   var margin = {top: 5, right: 65, bottom: 5, left: 35}, //read clockwise from top
//       width = parseInt(d3.select("body").style("width"), 10),
//       width = width - margin.left - margin.right,
//       agtHeight = 2,
//       xHeight = 10,
//       agtPadding = 2,
//       agtSpacing = 1;
//
//   // Line graph colors for each code
//   var color_pol = '#f5003d',
//       color_polps = '#01557a',
//       color_terps = '#fbdd4b',
//       color_eps = '#7a56a0',
//       color_mps = '#029680',
//       color_hrgen = '#f46c38',
//       color_gewom = '#59c9df',
//       color_tjmech = '#fc96ab';
//   var color_hrfra = '#95b162'; // REMOVE FROM TIMELINE VISUALS BECAUSE NOT ON MAP?!?!
//
//
//   // Obtain data
//   d3.csv("PAX_with_additional.csv")
//       .row(function(d){ return{ Year:+d.Year, //parseYear(d.Year),
//                                 Day:+d.Day,
//                                 Month:+d.Month,
//                                 Dat:parseDate(d.Dat),
//                                 AgtId:Number(d.AgtId),
//                                 Reg:d.Reg,
//                                 Con:d.Con,
//                                 Status:d.Status,
//                                 Agtp:d.Agtp,
//                                 Stage:d.Stage, // "Pre", "SubPar", "SubComp", "Imp", "Cea", "Other"
//                                 StageSub:d.StageSub, // "FrCons"
//                                 Agt:d.Agt,
//                               }; })
//       .get(function(error,data){
//
//           var svgTest = d3.select("body").select("svg");
//           if (!svgTest.empty()) {
//             svgTest.remove();
//           };
//
//           // Group agreements by Year (create an array of objects whose key is the year and value is an array of objects (one per agreement))
//           var years = d3.nest()
//                .key(function(d){ return d.Year; }).sortKeys(d3.ascending)
//                .sortValues(function(a,b){ return d3.descending(a.Dat, b.Dat); })
//                .entries(data);
//           var yrList = (d3.map(years, function(year){ return year.key; })).keys(); // array of year values
//           // console.log(years); // an array of objects
//           // console.log(years[0].values); // array of objects (one for each agreement in 1990)
//           // console.log(years[0].values[0]); // first agreement object from 1990
//           // console.log(years[0].values[0].Year); // Year (as number) of the first agreement object from 1990
//
//           // Count number of agreements per year (to use for proportions data)
//           var yr_count = d3.nest()
//               .key(function(d){ return d.Year; }).sortKeys(d3.ascending)
//               .rollup(function(leaves){ return leaves.length; })
//               .entries(data);
//           // Nest of codes (to use for proportions data)
//
//           // Find the maximum number of agreements in a single year
//           var maxAgts = d3.max(years, function(year){ return year.values.length; });
//           var height = (maxAgts*agtHeight)+(xHeight); //defines w & h as inner dimensions of chart area
//           // console.log(maxAgts); // 91
//
//           // Calculate the size of each agreement in the display space
//           var agtWidth = (width/(yrList.length))-agtPadding;
//
//           // Set up the x axis
//           var minYear = d3.min(data,function(d){ return parseYear(d.Year-1); });
//           var maxYear = d3.max(data,function(d){ return parseYear(d.Year+1); });
//           // Set up the axes
//           var x = d3.scaleTime()
//                       .domain([minYear,maxYear])  // data space
//                       .range([margin.left,width]);  // display space
//           var y = d3.scaleLinear()
//                       .domain([0, 1]) // tick format converts proportions to %
//                       .range([height-xHeight,0]);
//
//           // Define the full timeline chart SVG element
//           var svg = d3.select("body").select("#chart").append("svg")
//               .attr("height", height + margin.top + margin.bottom)
//               .attr("width", width + margin.left + margin.right);
//
//           // var chartGroup = svg.append("g")
//           //             .attr("class","chartGroup") //
//           //             .attr("transform","translate("+margin.left+","+margin.top+")")
//
//
//           /*
//           Draw line graphs of proportions
//           */
//           var codes = ["GeWom", "HrFra", "HrGen", "Eps", "Mps", "Pol", "Polps", "Terps", "TjMech"];
//           var codeFilters = [+paxGeWom, +paxHrFra, +paxHrGen, +paxEps, +paxMps, +paxPol, +paxPolps, +paxTerps, +paxTjMech];
//           var codeColors = [color_gewom, color_hrfra, color_hrgen, color_eps, color_mps, color_pol, color_polps, color_terps, color_tjmech];
//
//           if (paxANY == 1){
//             var propData = manyLinesData(data, codes, codeFilters); // [ {key:code, values:[{yr:total}{yr:total}{yr:total}}], {key:code, values:[{yr:total}{yr:total}{yr:total}}], ... ]
//           }
//           if (paxALL == 1){
//             var propData = oneLineData(data, years, codeFilters); // [{ key: combined, values: [ {yr:total}{yr:total}{yr:total}, {yr:total}{yr:total}{yr:total}, ... ] }
//           }
//
//           for (c = 0; c < propData.length; c++){
//             var valueLine = d3.line()
//                 .x(function(d){ return x(parseYear(d.key)); })
//                 .y(function(d){ return y(d.value); });
//
//             svg.append("path")
//                 .data([propData]) //.filter(setAgtCons(d))
//                 .attr("class","line")
//                 .attr("id",String(c))
//                 .attr("d",valueLine)
//                 // .attr("id",String(codeFilters[codeI]))
//           }
//
//           /*
//           Obtain line data
//           */
//
//           // Line for all selected codes combined
//           function oneLineData(data, years, codeFilters){
//             var codeLine = [];
//             for (yearI = 0; yearI < years.length; yearI++){
//               var yearData = years[yearI].values
//               // One line for all selected codes combined
//               var lineData = {};
//               var yrTotal = 0;
//               for (codeI = 0; codeI < codeFilters.length; codeI++){
//                 var codeTotal = 0;
//                 var agmts_by_code = d3.nest()
//                                     .key(function(d){
//                                       var agmtCodes = [d.GeWom, d.HrFra, d.HrGen, d.Eps, d.Mps, d.Pol, d.Polps, d.Terps, d.TjMech];
//                                       return agmtCodes[codeI];
//                                     })
//                                     .sortKeys(d3.descending)
//                                     .rollup(function(leaves){ return leaves.length; })
//                                     .entries(yearData);
//                 // Count agreements that address the code (key > 0)
//                 for (i = 0; i < agmts_by_code.length; i++){
//                   if ((+agmts_by_code[i].key) != 0){
//                     codeTotal += +(agmts_by_code[i].value);
//                   }
//                 }
//                 yrTotal += codeTotal; // sum the yearly total for each code
//               }
//               lineData[years[yearI].key] = yrTotal/(yearData.length); // assign yearly total for all codes combined to corresponding year
//               codeLine.push(lineData); // add year and total as point to plot in combined code line
//             }
//             var combined = [{"key":"combined", "values": codeLine }];
//             console.log(combined);
//             return combined;
//           }
//
//           // Lines for selected codes individually
//           function manyLinesData(data, codes, codeFilters){
//             var codeLines = [];
//             for (codeI = 0; codeI < codeFilters.length; codeI++){
//               // For every selected code...
//               if (agmtCodes[codeI] > 0){
//                 var code = codes[codeI];
//                 var codeLine = {};
//                 var agmts_by_yrcode = d3.nest()
//                                     .key(function(d){ return d.Year; }).sortKeys(d3.ascending)
//                                     .key(function(d){
//                                       var agmtCodes = [d.GeWom, d.HrFra, d.HrGen, d.Eps, d.Mps, d.Pol, d.Polps, d.Terps, d.TjMech];
//                                       return agmtCodes[codeI];
//                                     })
//                                     .sortKeys(d3.descending)
//                                     .rollup(function(leaves){ return leaves.length; })
//                                     .entries(data);
//                 // Count agreements that address the code (key > 0)
//                 for (i = 0; i < agmts_by_yrcode.length; i++){
//                   var codeData = {};
//                   var yrTotal = 0;
//                   var yearData = agmts_by_yrcode[i];
//                   for (j = 0; j < yearData.length; j++){
//                     if ((+yearData[j].key) != 0){
//                       yrTotal += yrData[j].value; // total agreements with code value 1, 2, and 3 for current year
//                     }
//                   }
//                   codeData[yearData.key] = yrTotal; // record total agreements that address code for each year
//                 }
//                 codeLine[code] = codeData;
//               }
//               codeLines.push(codeLines); // add all years' worth of data for each code (each addition will be a new line)
//             }
//             console.log(codeLines);
//             return codeLines;
//           }
//
//           // function setLineVisibility(codeI){
//           //     // Hide any agreement without at least one checked code
//           //     if (paxANY == 1 && paxALL == 0){
//           //       var matchCount = 0;
//           //       for (i = 0; i < codeFilters.length; i++){
//           //         if ((codeFilters[i] == 1) && (agmtCodes[i] > 0)){
//           //           matchCount += 1;
//           //           return "visible";
//           //         }
//           //       }
//           //       if (matchCount == 0){ return "hidden"; }
//           //     }
//           //     // Hide any agreement without all checked codes
//           //     if (paxANY == 0 && paxALL == 1) {
//           //       for (i=0; i < codeFilters.length; i++){
//           //         if ((codeFilters[i] == 1) && (agmtCodes[i] == 0)) {
//           //           return "hidden";
//           //         }
//           //       }
//           //     }
//           // }
//           //
//           // function setAgtCons(d){
//           //   // TO DO: list item is single con/entity
//           //   var agmtCon = String(d.Con);
//           //   if (paxConRule == "any"){
//           //     if (paxCons.length > 0){
//           //       for (i = 0; i < paxCons.length; i++){
//           //         // if (!(agmtCon.includes(paxCons[i]))){
//           //         //   console.log(agmtCon);
//           //         // }
//           //         if (agmtCon.includes(paxCons[i])){
//           //           return d;
//           //         }
//           //       }
//           //     }
//           //   }
//           //   if (paxConRule == "all") {
//           //     var mismatch = false;
//           //     for (j = 0; j < paxCons.length; j++){
//           //       if (!(agmtCon.includes(paxCons[j]))){
//           //         mismatch = true;
//           //         // console.log("Mismatched: "+agmtCon);
//           //       }
//           //     }
//           //     if (!mismatch){
//           //       return d;
//           //     }
//           //   }
//           // }
//
//           // Draw axes
//           var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%e %b %Y")).tickPadding([5]);
//           var gX = svg.append("g")
//                .attr("class","xaxis")
//                .attr("transform","translate(0,"+(height-xHeight)+")")
//                .call(xAxis);
//           var yAxis = d3.axisLeft(y).tickFormat(d3.format(".0%")).ticks(5);
//           var gY = svg.append("g")
//                 .attr("class", "yaxis")
//                 .attr("transform","translate("+margin.left+",0)")
//                 .call(yAxis);
//     });
// }
