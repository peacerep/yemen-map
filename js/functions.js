"use strict";

// Definitions and functions for both PaxVis pages

// tau
var tau = 2 * Math.PI;

// Date parsers & formatters
var parseDate = d3.timeParse("%d/%m/%Y");
var parseMonth = d3.timeParse("%m");
var parseYear = d3.timeParse("%Y");
var parseDay = d3.timeParse("%j");
var formatDate = d3.timeFormat("%d %B %Y");
var formatMonth = d3.timeFormat("%m");
var formatDay = d3.timeFormat("%j"); // day of the year as decimal number
var formatYear = d3.timeFormat("%Y");

// Codes
const codesLong = {
	HrFra: "Human Rights Framework",
	Mps: "Power Sharing: Military",
	Eps: "Power Sharing: Economic",
	Terps: "Power Sharing: Territorial",
	Polps: "Power Sharing: Political",
	Pol: "Political Institutions",
	GeWom: "Women, Girls and Gender",
	TjMech: "Transitional Justice Past Mechanism"
};

const codes = Object.keys(codesLong);

const codesRange = {
	HrFra: [0, 3],
	Mps: [0, 3],
	Eps: [0, 3],
	Terps: [0, 3],
	Polps: [0, 3],
	Pol: [0, 3],
	GeWom: [0, 1],
	TjMech: [0, 3]
};

var codeColour = d3
	.scaleOrdinal()
	.domain(["Pol", "Polps", "Terps", "Eps", "Mps", "HrFra", "GeWom", "TjMech"])
	.range([
		"#f5003d",
		"#01557a",
		"#fbdd4b",
		"#7a56a0",
		"#029680",
		"#f46c38",
		"#59c9df",
		"#fc96ab"
	]);

function makeCodesCheckboxes(colour) {
	var codesCheckboxes = d3
		.select("#codesCheckboxes")
		.selectAll("label")
		.data(codes)
		.enter()
		.append("label")
		.classed("cb-container", true);
	codesCheckboxes.html(d => codesLong[d] + "<br>");
	codesCheckboxes
		.append("input")
		.attr("type", "checkbox")
		.attr("id", d => "checkbox" + d)
		.classed("input", true)
		.property("checked", false);
	var checkmark = codesCheckboxes.append("span").classed("checkmark", true);

	if (colour) {
		checkmark.style("background-color", d => codeColour(d));
	} else {
		checkmark.style("background-color", "#444");
	}
}

function getSelectedCodes() {
	// reads the code checkboxes and returns an object with their status
	var filters = {
		any: document.getElementById("anyCodes").checked, //otherwise ALL
		codes: []
	};

	for (var i = 0; i < codes.length; i++) {
		if (document.getElementById("checkbox" + codes[i]).checked) {
			filters.codes.push(codes[i]);
		}
	}
	return filters;
}

// Stages

var stagesLong = {
	Cea: "Ceasefire/related",
	Pre: "Prenegotiation",
	SubPar: "Framework-substantive, partial",
	SubComp: "Framework-substantive, comprehensive",
	FrCons: "Constitution",
	Imp: "Implementation",
	Ren: "Renewal",
	Other: "Other"
};

var substagesLong = {
	Proc: "Process",
	Prin: "Principles",
	Conf: "Confidence-building measure",
	PreMix: "Mixed",
	PreOth: "Other",
	Iss: "Core issues",
	MultIss: "Partial but multiple issues",
	FrparOth: "Other",
	FrAg: "Comprehensive",
	FrCons: "Constitution",
	ImpMod: "Implementation modalities",
	ExtSub: "Substantive Extending",
	ExtPar: "Partial Extending",
	ImpOth: "Other",
	Reimp: "Renewal of an implementation agreement",
	Repre: "Renewal of a pre-negotiation agreement",
	Resub: "Renewal of an agreement dealing with substantive issues",
	Reoth: "Renewal of other type of agreement",
	Ceas: "Ceasefire agreement",
	Rel: "Ceasefire-related",
	CeaMix: "Ceasefire-mixed"
};

var stages = Object.keys(stagesLong);

function stageColour(d, fake = false) {
	// can't just be a d3 scale because the colour could be either from
	// d.Stage or d.StageSub
	var stage = d3
		.scaleOrdinal()
		.domain([
			"Other",
			"Cea",
			"Pre",
			"SubPar",
			"SubComp",
			"FrCons",
			"Imp",
			"Ren"
		])
		.range([
			"#8c8c8c",
			"#ffe41c",
			"#FDB32F",
			"#ED7953",
			"#CC4678",
			"#9C179E",
			"#5D01A6",
			"#0D0887"
		]);
	// .range(["#8c8c8c", "#440154", "#443A83", "#31688E", "#21908C", "#35B779", "#8FD744", "#FDE725"])

	// old colours
	// .range(["#fb8072", "#8dd3c7", "#ffffb3", "#fdb462", "#b3de69", "#bebada", "#8c8c8c"])
	// var cons = "#80b1d3"

	if (fake) {
		var col = stage(d);
	} else {
		var cons = stage("FrCons");
		var col = d.StageSub == "FrCons" ? cons : stage(d.Stage);
	}
	return col;
}

// Type
const agreementTypes = {
	Inter: "Interstate/interstate  conflict",
	InterIntra: "Interstate/mixed or intrastate conflict",
	Intra: "Intrastate conflict"
};

// extract min and max year from data
function getYears(data) {
	var minYear = d3.min(
		data.map(function(d) {
			return d.Year;
		})
	);
	var maxYear = d3.max(
		data.map(function(d) {
			return d.Year;
		})
	);
	return [minYear, maxYear];
}

// gets unique con names from the data
function getConNames(dat) {
	// get all unique Con values
	var cons = dat.map(function(d) {
		return d.Con;
	});
	cons = cons.reduce((acc, val) => acc.concat(val));
	// get the unique ones
	cons = [...new Set(cons)];
	// sort alphabetically
	cons = cons.sort();
	return cons;
}

// split con names into array when loading in data
function splitConNames(item) {
	// input is one data point d.Con
	// split into array of con names
	var cons = item.split("/");

	// deal with a special case which has slashes in its name
	// "Rebolusyonaryong Partido ng Manggagawa-Pilipineas (RPMP/RPA/ABB)"
	var rpmp = cons.findIndex(element => element.search("(RPMP)$") != -1);
	if (rpmp != -1) {
		cons[rpmp] = [cons[rpmp], cons[rpmp + 1], cons[rpmp + 2]].join("/");
		cons.splice(rpmp + 1, 2);
	}

	// remove brackets if they both open and close a string
	// this is so that names like 'Yugoslavia (former)' stay intact
	cons = cons.map(function(d) {
		// check if string is enclosed in brackets ()
		if (d.search("^[(].*[)]$") != -1) {
			// return the string minus the 1st and last character
			return d.substr(1, d.length - 2);
		} else {
			return d;
		} // otherwise return the original string
	});

	return cons;
}

// function uniqueCons(data) {
// 	var allCons = []
// 	for (var i = 0; i < data.length; i++) {
// 		allCons.push(...data[i].Con)
// 	}
// 	var uniqueCons = [...new Set(allCons)]
// 	return uniqueCons
// }

// update agreement info box
function agtDetails(d) {
	if (d == null) {
		//clear
		var infoString =
			"<i>Hover over or click timeline and map elements to view details of the agreements they represent.</i>";
	} else {
		var infoString =
			"<b>" +
			d.Agt +
			"</b><br>" +
			"<table><tr><td>Date Signed:</td><td>" +
			formatDate(d.Dat) +
			"</td></tr><tr><td>Country/Entity:</td><td>" +
			printArray(d.Con) +
			"</td></tr><tr><td>Status:</td><td>" +
			d.Status +
			"</td></tr><tr><td>Type:</td><td>" +
			agreementTypes[d.Agtp] +
			"</td></tr><tr><td>Stage:</td><td>" +
			stagesLong[d.Stage] +
			"</td></tr><tr><td>Sub-Stage:</td><td>" +
			substagesLong[d.StageSub] +
			"</td></tr></table>" +
			'<a class="button" href="https://www.peaceagreements.org/masterdocument/' +
			d.AgtId +
			'" target = "_blank">Open PDF</a>&nbsp;<a class="button" href="' +
			"https://www.peaceagreements.org/view/" +
			d.AgtId +
			'" target = "_blank">View Coding Detail</a>';
	}
	d3.select("#agreementDetails").html(infoString);
}

// https://github.com/wbkd/d3-extended
d3.selection.prototype.moveToFront = function() {
	return this.each(function() {
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

// parse transform attribute
// https://stackoverflow.com/questions/17824145/parse-svg-transform-attribute-with-javascript
function parseTransform(a) {
	var b = {};
	for (var i in (a = a.match(/(\w+\((\-?\d+\.?\d*e?\-?\d*,?)+\))+/g))) {
		var c = a[i].match(/[\w\.\-]+/g);
		b[c.shift()] = c;
	}
	return b;
}

function printArray(arr) {
	var str = "";
	arr.forEach(function(d) {
		str = str + d + ", ";
	});
	str = str.slice(0, str.length - 2);
	return str;
}