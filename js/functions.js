"use strict"

// FUNCTIONS AND VARS USED FOR ALL PAXVIS VISUALISATIONS

// tau
var tau = 2 * Math.PI;

// Date parsers & formatters
var parseDate = d3.timeParse("%d/%m/%Y");
var parseMonth = d3.timeParse("%m");
var parseYear = d3.timeParse("%Y");
var parseDay = d3.timeParse("%j");
var formatDate = d3.timeFormat("%d %B %Y");
var formatMonth = d3.timeFormat("%m");
var formatDay = d3.timeFormat("%j");  // day of the year as decimal number
var formatYear = d3.timeFormat("%Y");

// Codes
var codesLong = {HrFra: 'Human Rights Framework',
		Mps: 'Power Sharing: Military',
		Eps: 'Power Sharing: Economic',
		Terps: 'Power Sharing: Territorial',
		Polps: 'Power Sharing: Political',
		Pol: 'Political Institutions',
		GeWom: 'Women, Girls and Gender',
		TjMech: 'Transitional Justice Past Mechanism'}

var codes = Object.keys(codesLong)

var codeColour = d3.scaleOrdinal()
	.domain(['Pol', 'Polps', 'Terps', 'Eps', 'Mps', 'HrFra', 'GeWom', 'TjMech'])
	.range(['#f5003d','#01557a','#fbdd4b','#7a56a0','#029680','#f46c38','#59c9df','#fc96ab'])

// Stages
var stagesLong = {Cea: 'Ceasefire/related',
		Pre: 'Prenegotiation',
		SubPar: 'Framework-substantive, partial',
		SubComp: 'Framework-substantive, comprehensive',
		FrCons: 'Constitution',
		Imp: 'Implementation',
		Ren: 'Renewal',
		Other: 'Other'}

var stages = Object.keys(stagesLong)

function stageColour(d) {
	// can't just be a d3 scale because the colour could be either from
	// d.Stage or d.StageSub
	// (Colors from: http://colorbrewer2.org/#type=qualitative&scheme=Set3&n=7)
	var stage = d3.scaleOrdinal()
		.domain(['Cea', 'Pre', 'SubPar', 'SubComp', 'Imp', 'Ren', 'Other'])
		.range(["#fb8072", "#8dd3c7", "#ffffb3", "#fdb462", "#b3de69", "#bebada", "#8c8c8c"])
		// red turquoise yellow orange green purple grey
	var cons = "#80b1d3" // blue
	var col = (d.StageSub == 'FrCons' ? cons : stage(d.Stage));
	return col
}


function getYears(data) {
	var minYear = d3.min(data.map(function(d) {return d.Year}))
	var maxYear = d3.max(data.map(function(d) {return d.Year}))
	return [minYear, maxYear]
}

// replace this! 
function getConNames (dat) {

	// get all unique Con values
	var cons = dat.map(function(d){return d.Con;})

	cons = cons.reduce((acc, val) => acc.concat(val))
		// get the unique ones
	cons = [...new Set(cons)]
	// sort alphabetically
	cons = cons.sort()

	return cons
}

function splitConNames(item) {
	// input is one data point d.Con
	// split into array of con names
	var cons = item.split('/')

	// deal with a special case which has slashes in its name
	// "Rebolusyonaryong Partido ng Manggagawa-Pilipineas (RPMP/RPA/ABB)"
	var rpmp = cons.findIndex(element => element.search('(RPMP)$') != -1)
	if (rpmp != -1) {
		cons[rpmp] = [cons[rpmp], cons[rpmp+1], cons[rpmp+2]].join('/')
		cons.splice(rpmp+1, 2)
	}

	// remove brackets if they both open and close a string
	// this is so that names like 'Yugoslavia (former)' stay intact
	cons = cons.map(function(d) {
		// check if string is enclosed in brackets ()
		if (d.search( '^[(].*[)]$' ) != -1) {
			// return the string minus the 1st and last character
			return d.substr(1,d.length-2)
		} 
		else { return d } // otherwise return the original string
	})

	return cons
}

function uniqueCons(data) {
	var allCons = []
	for (var i = 0; i < data.length; i++) {
		allCons.push(...data[i].Con)
	}
	var uniqueCons = [...new Set(allCons)]
	return uniqueCons
}

function agtDetails(d) {
	if (d==null) {
		//clear
		var infoString = '<i>Hover over or click timeline and map elements to view details of the agreements they represent.</i>'
	} else {
		var infoString = "<table><tr><td>Title:</td><td>" + d.Agt +
		"</td></tr><tr><td>Date Signed:</td><td>" + formatDate(d.Dat) + 
		"</td></tr><tr><td>Country/Entity:</td><td>"+ d.Con +
		"</td></tr><tr><td>Status:</td><td>"+ d.Status +
		"</td></tr><tr><td>Type:</td><td>"+ d.Agtp +
		"</td></tr><tr><td>Stage:</td><td>"+ d.Stage +
		"</td></tr><tr><td>Sub-Stage:</td><td>"+ d.StageSub +
		"</td></tr></table><br>" +
		'<a href="https://www.peaceagreements.org/masterdocument/' + d.AgtId +
		'" target = "_blank">Open PDF</a>&nbsp;<a href="' + 
		'https://www.peaceagreements.org/view/' + d.AgtId + 
		'" target = "_blank">View Coding Detail</a>'
	}
	d3.select('#agreementDetails').html(infoString)
}

// https://github.com/wbkd/d3-extended
d3.selection.prototype.moveToFront = function() {  
	return this.each(function(){
		this.parentNode.appendChild(this);
	});
};
d3.selection.prototype.moveToBack = function() {  
	return this.each(function() { 
		var firstChild = this.parentNode.firstChild; 
		if (firstChild) { 
			this.parentNode.insertBefore(this, firstChild); 
		} 
	});
};

function transform(t) {
  return function(d) {
  	// console.log(d)
    return "translate(" + t.apply(d.loc) + ")";
  };
}