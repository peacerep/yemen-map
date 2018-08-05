/*
Line graph to sit on top of bar graph
*/

// Trends data (one file per code filter)
var data_yr_nested = d3.csv("PAX_with_additional.csv").nest()
      .key(function(d){ return d.Year; }).sortKeys(d3.ascending)
      .rollup(function(leaves){ return leaves.length; })

var data_GeWom_nested = d3.csv("data/PAX_GeWom.csv").nest()
      .key(function(d){ return d.Year; }).sortKeys(d3.ascending)
      .rollup(function(leaves){ return leaves.length; })
      .entries(data);

var data_Polps_nested = d3.csv("data/PAX_Polps.csv")d3.nest()
      .key(function(d){ return d.Year; }).sortKeys(d3.ascending)
      .rollup(function(leaves){ return leaves.length; })
      .entries(data);

var data_Terps_nested = d3.csv("data/PAX_Terps.csv").nest()
      .key(function(d){ return d.Year; }).sortKeys(d3.ascending)
      .rollup(function(leaves){ return leaves.length; })
      .entries(data);

var data_Eps_nested = d3.csv("data/PAX_Eps.csv").nest()
      .key(function(d){ return d.Year; }).sortKeys(d3.ascending)
      .rollup(function(leaves){ return leaves.length; })
      .entries(data);

var data_Mps_nested = d3.csv("data/PAX_Mps.csv").nest()
      .key(function(d){ return d.Year; }).sortKeys(d3.ascending)
      .rollup(function(leaves){ return leaves.length; })
      .entries(data);

var data_Pol_nested = d3.csv("data/PAX_Pol.csv").nest()
      .key(function(d){ return d.Year; }).sortKeys(d3.ascending)
      .rollup(function(leaves){ return leaves.length; })
      .entries(data);

var data_HrGen_nested = d3.csv("data/PAX_HrGen.csv").nest()
      .key(function(d){ return d.Year; }).sortKeys(d3.ascending)
      .rollup(function(leaves){ return leaves.length; })
      .entries(data);

var data_HrFra_nested = d3.csv("data/PAX_HrFra.csv").nest()
      .key(function(d){ return d.Year; }).sortKeys(d3.ascending)
      .rollup(function(leaves){ return leaves.length; })
      .entries(data);

var data_TjMech_nested = d3.csv("data/PAX_TjMech.csv").nest()
      .key(function(d){ return d.Year; }).sortKeys(d3.ascending)
      .rollup(function(leaves){ return leaves.length; })
      .entries(data);

// Set local storage values for each code's trend line
var paxHrFraL = window.localStorage.setItem("paxHrFraL",0); // Human rights framework
var paxHrGenL = window.localStorage.setItem("paxHrGenL",0);; // Human rights/Rule of law
var paxMpsL = window.localStorage.setItem("paxPolL",0); // Military power sharing
var paxEpsL = window.localStorage.setItem("paxEpsL",0); // Economic power sharing
var paxTerpsL = window.localStorage.setItem("paxMpsL",0); // Territorial power sharing
var paxPolpsL = window.localStorage.setItem("paxPolpsL",0); // Political power sharing
var paxPolL = window.localStorage.setItem("paxTerpsL",0); // Political institutions
var paxGeWomL = window.localStorage.setItem("paxTjMechL",0); // Transitional justice past mechanism
var paxTjMechL = window.localStorage.setItem("paxGeWomL",0); // Women, girls and gender

var paxViewLine = window.localStorage.setItem("paxViewLine",0);
if window.localStorage.getItem("paxViewLine") == 1{
  drawLine()
}

d3.select(window).on("resize", drawLine());
window.addEventListener("storage", drawLine());

// Date parsers & formatters
var parseDate = d3.timeParse("%d/%m/%Y");
var parseMonth = d3.timeParse("%m");
var parseYear = d3.timeParse("%Y");
var parseDay = d3.timeParse("%j");
var formatDate = d3.timeFormat("%d %B %Y");
var formatMonth = d3.timeFormat("%m");
var formatDay = d3.timeFormat("%j");  // day of the year as decimal number
var formatYear = d3.timeFormat("%Y");

// Same setup as timeline-yearlyGroups.js
var margin = {top: 5, right: 65, bottom: 5, left: 5}, //read clockwise from top
    width = parseInt(d3.select("body").style("width"), 10),
    width = width - margin.left - margin.right,
    agtHeight = 2,
    xTickHeight = 15,
    agtPadding = 5,
    agtSpacing = 1;

// Code trend lines (visible = 1, hidden = 0)
var locStor = window.localStorage,
    paxHrFraL = locStor.getItem("paxHrFraL"),
    paxHrGenL = locStor.getItem("paxHrGenL"),
    paxMpsL = locStor.getItem("paxMpsL"),
    paxEpsL = locStor.getItem("paxEpsL"),
    paxTerpsL = locStor.getItem("paxTerpsL"),
    paxPolpsL = locStor.getItem("paxPolpsL"),
    paxPolL = locStor.getItem("paxPolL"),
    paxGeWomL = locStor.getItem("paxGeWomL"),
    paxTjMechL = locStor.getItem("paxTjMechL");

// Array of year values
var yrList = (d3.map(data_yr_nested, function(year){ return year.key; })).keys();

// Find the maximum number of agreements in a single year
var maxAgts = d3.max(data_yr_nested, function(year){ return year.values; });
var height = (maxAgts*(agtHeight*1.25))+(xTickHeight*2) + margin.top + margin.bottom; //defines w & h as inner dimensions of chart area
// console.log(maxAgts); // 91

// Calculate the size of each agreement in the display space
var agtWidth = (width/(yrList.length))-agtPadding;

// Set up the axes
var minYear = d3.min(data,function(d){ return parseYear(d.Year-1); });
var maxYear = d3.max(data,function(d){ return parseYear(d.Year); });
var x = d3.scaleTime()
            .domain([minYear,maxYear])  // data space
            .range([margin.left,width]);  // display space
var y = d3.scaleLinear()
            .domain([0, maxAgts])
            .range([height-xHeight,0])

// Define an SVG element to sit on top of the timeline chart SVG element
var svg = d3.select("body").select("#chart").append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)


// Visualize yearly proportion of agreements that address selected codes
// (hide or view depending on local storage values)
function drawLine(code){

}
