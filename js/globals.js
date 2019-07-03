"use strict";
// GLOBAL VARIABLES + SETTINGS

// Tau
const tau = 2 * Math.PI;

// Visualisation Parameters: Define sizes etc.
const glyphR = 20; // radius of one glyph on the map
const natBoxW = 250; // width of national level agreements box
const natBoxN = 4; // number of agreements in one row in the nat. level agt. box
// 25 national level agreements
const natBoxT = 30;
const natBoxH = natBoxT + (natBoxW / natBoxN) * Math.ceil(25 / 4);

// Year range of the data
const minYear = 1990;
const maxYear = 2019;

// Date parsers & formatters
var parseDate = d3.timeParse("%Y-%m-%d"); //e.g. 2011-12-05
var parseYear = d3.timeParse("%Y");
var formatDate = d3.timeFormat("%d %B %Y");
var formatYear = d3.timeFormat("%Y");

// Codes (long version)
// This a subset of 8 codes from the many more included in PA-X
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

// Codes (short names only)
const codes = Object.keys(codesLong);

// Range of score for each code
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

// Colour scale for codes
const codeColour = d3
	.scaleOrdinal()
	.domain(["Pol", "Polps", "Terps", "Eps", "Mps", "HrFra", "GeWom", "TjMech"])
	.range([
		"#479B7F",
		"#B5B867",
		"#DFBA47",
		"#BD6221",
		"#A33A36",
		"#e4549b",
		"#335B8E",
		"#78387D"
	]);

// Peace Process Stages
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

// Peace Process Substages
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

// PP Stages short names
var stages = Object.keys(stagesLong);

// Colour Scale for PP Stage
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

	// for cases where the stage/substage distinction is irrelevant
	// currently used for creating the legend
	if (fake) {
		var col = stage(d);
	} else {
		var cons = stage("FrCons");
		var col = d.substage == "FrCons" ? cons : stage(d.stage);
	}
	return col;
}

// Types of agreement
const agreementTypes = {
	Inter: "Interstate/interstate  conflict",
	InterIntra: "Interstate/mixed or intrastate conflict",
	Intra: "Intrastate conflict"
};

////////////////////////////////////////////////////////////////////////////////
// Data helper functions
////////////////////////////////////////////////////////////////////////////////

// reading in data + preprocessing rows
function parseData(d) {
	return {
		year: +d.Year,
		date: parseDate(d.Dat),
		id: +d.AgtId,
		con: splitConNames(d.Con),
		local: parseBool(d.Local),
		localLon: d.LocalLon,
		localLat: d.LocalLat,
		localComment: d.Comment,
		status: d.Status,
		type: d.Agtp,
		stage: d.Stage,
		substage: d.StageSub,
		process: d.PPName,
		processid: +d.PP,
		title: d.Agt,
		GeWom: +d.GeWom,
		Polps: +d.Polps,
		Terps: +d.Terps,
		Eps: +d.Eps,
		Mps: +d.Mps,
		Pol: +d.Pol,
		HrFra: +d.HrFra,
		TjMech: +d.TjMech
	};
}

function parseBool(str) {
	if (str === "TRUE") {
		return true;
	} else if (str === "FALSE") {
		return false;
	} else {
		return undefined;
	}
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

// gets unique con names from the data
function getConNames(dat) {
	// get all unique Con values
	var cons = dat.map(function(d) {
		return d.con;
	});
	cons = cons.reduce((acc, val) => acc.concat(val));
	// get the unique ones
	cons = [...new Set(cons)];
	// sort alphabetically
	cons = cons.sort();
	return cons;
}

// Filter data based on settings in filter pane
function filterData(data, f) {
	// console.log(data);

	var filtered = data.filter(function(d) {
		if (d.year >= f.year[0] && d.year <= f.year[1]) {
			// console.log("passed");
			// year check passed
			if (f.codes.codes.length == 0) {
				var c1 = true;
			} else {
				if (f.codes.any) {
					var c1 = f.codes.codes.some(function(code) {
						return d[code] > 0;
					});
				} else {
					var c1 = f.codes.codes.every(function(code) {
						return d[code] > 0;
					});
				}
			}

			if (c1) {
				// codes check passed
				if (f.cons.cons.length == 0) {
					return true; // cons check passed
				} else {
					if (f.cons.any) {
						return f.cons.cons.some(function(con) {
							return d.con.findIndex(c => c == con) != -1;
						});
					} else {
						return f.cons.cons.every(function(con) {
							return d.con.findIndex(c => c == con) != -1;
						});
					}
				}
			} else {
				return false;
			} // codes check failed
		} else {
			return false;
		} // year check failed
	});
	return filtered;
}

// Data for petals
function petalData(d) {
	var activeCodes = [];
	for (var i = 0; i < codes.length; i++) {
		if (d[codes[i]]) {
			activeCodes.push(codes[i]);
		}
	}
	if (!activeCodes.length) {
		return [];
	} else {
		var incr = tau / codes.length;
		var obj = [];
		for (var i = 0; i < codes.length; i++) {
			if (activeCodes.includes(codes[i])) {
				obj.push({
					startAngle: i * incr,
					endAngle: (i + 1) * incr,
					colour: codeColour(codes[i]),
					code: codes[i],
					score: d[codes[i]]
				});
			}
		}
		return obj;
	}
}

var arcMin = d3
	.arc()
	.innerRadius(0)
	.outerRadius(function(d) {
		return d3
			.scaleSqrt()
			.domain(codesRange[d.code])
			.range([0, glyphR])(d.score);
	})
	.cornerRadius(5);

// extract min and max year from data
// function getYears(data) {
// 	var minYear = d3.min(
// 		data.map(function(d) {
// 			return d.year;
// 		})
// 	);
// 	var maxYear = d3.max(
// 		data.map(function(d) {
// 			return d.year;
// 		})
// 	);
// 	return [minYear, maxYear];
// }

////////////////////////////////////////////////////////////////////////////////
// Filter Setup + Helpers
////////////////////////////////////////////////////////////////////////////////

// Creating the Codes checkboxes
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

// Reading the status of the Codes checkboxes in the filter pane
function getSelectedCodes() {
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

// Checking which countries/entities are selected in the filter pane
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

// Create a list of the selected countries/entities
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

// Draw time slider into the #timeslider div (very long function)
function initSlider() {
	var range = [minYear, maxYear + 1];

	// set width and height of svg
	var w = parseInt(
		window.getComputedStyle(document.getElementById("sidebar")).width
	);
	// var w = 270
	var h = 65;
	var margin = { top: 10, bottom: 15, left: 10, right: 10 };
	var labelpadding = 38; // keeps the labels from sliding out of sight

	// dimensions of slider bar
	var width = w - margin.left - margin.right;
	var height = h - margin.top - margin.bottom;

	// create x scale
	var x = d3
		.scaleLinear()
		.domain(range) // data space
		.range([0, width]); // display space

	// create svg and translated g
	var svg = d3
		.select("#timeslider")
		.append("svg")
		.attr("width", w)
		.attr("height", h);
	const g = svg
		.append("g")
		.attr("transform", `translate(${margin.left}, ${margin.top})`);

	// draw background lines
	g.append("g")
		.selectAll("line")
		.data(d3.range(range[0], range[1] + 1))
		.enter()
		.append("line")
		.attr("x1", d => x(d))
		.attr("x2", d => x(d))
		.attr("y1", 0)
		.attr("y2", height)
		.style("stroke", "#ccc");

	// labels
	var labelL = g
		.append("text")
		.attr("id", "labelleft")
		.attr("x", 0)
		.attr("y", height)
		.text(range[0]);

	var labelR = g
		.append("text")
		.attr("id", "labelright")
		.attr("x", 0)
		.attr("y", height)
		.text(range[1]);

	// define brush
	var brush = d3
		.brushX()
		.extent([[0, 0], [width, height]])
		.on("brush", function() {
			var s = d3.event.selection;
			// update and move labels
			labelL
				.attr("x", s[0] < labelpadding ? labelpadding : s[0])
				.text(Math.round(x.invert(s[0])));
			labelR
				.attr("x", s[1] > width - labelpadding ? width - labelpadding : s[1])
				.text(Math.round(x.invert(s[1])) - 1);
			// move brush handles
			handle.attr("display", null).attr("transform", function(d, i) {
				return "translate(" + [s[i], -height / 4] + ")";
			});
			// update selection
			// console.log(s.map(d => Math.round(x.invert(d))))
		})
		.on("end", function() {
			if (!d3.event.sourceEvent) return;
			var d0 = d3.event.selection.map(x.invert);
			var d1 = d0.map(Math.round);
			d3.select(this)
				.transition()
				.call(d3.event.target.move, d1.map(x));
			let event = new Event("change");
			eventHandler.dispatchEvent(event);
		});

	// append brush to g
	var gBrush = g
		.append("g")
		.attr("class", "brush")
		.call(brush);

	// add brush handles (from https://bl.ocks.org/Fil/2d43867ba1f36a05459c7113c7f6f98a)
	var brushResizePath = function(d) {
		var e = +(d.type == "e"),
			x = e ? 1 : -1,
			y = height / 2;
		// prettier-ignore
		return ("M" +	0.5 * x +	"," +	y + "A6,6 0 0 " +	e +	" " +	6.5 * x +	"," +
			(y + 6) +	"V" +	(2 * y - 6) +	"A6,6 0 0 " +	e +	" " +	0.5 * x +	"," +
			2 * y +	"Z" +	"M" +	2.5 * x +	"," +	(y + 8) +	"V" +	(2 * y - 8) +	"M" +
			4.5 * x +	"," +	(y + 8) +	"V" +	(2 * y - 8));
	};

	var handle = gBrush
		.selectAll(".handle--custom")
		.data([{ type: "w" }, { type: "e" }])
		.enter()
		.append("path")
		.attr("class", "handle--custom")
		.attr("stroke", "#000")
		.attr("fill", "#eee")
		.attr("cursor", "ew-resize")
		.attr("d", brushResizePath);

	// override default behaviour - clicking outside of the selected area
	// will select a small piece there rather than deselecting everything
	// https://bl.ocks.org/mbostock/6498000
	gBrush
		.selectAll(".overlay")
		.each(function(d) {
			d.type = "selection";
		})
		.on("mousedown touchstart", brushcentered);

	function brushcentered() {
		var dx = x(1) - x(0), // Use a fixed width when recentering.
			cx = d3.mouse(this)[0],
			x0 = cx - dx / 2,
			x1 = cx + dx / 2;
		d3.select(this.parentNode).call(
			brush.move,
			x1 > width ? [width - dx, width] : x0 < 0 ? [0, dx] : [x0, x1]
		);
	}

	// select entire range
	var resetBrush = function() {
		gBrush.call(brush.move, range.map(x));
	};

	var getRange = function() {
		var range = d3
			.brushSelection(gBrush.node())
			.map(d => Math.round(x.invert(d)));
		return [range[0], range[1] - 1];
	};

	resetBrush();

	return { getRange: getRange, resetBrush: resetBrush };
}

// Reset filters and visualisation
function resetFilters() {
	console.log("resetting filters");

	// Time
	timeSlider.resetBrush();

	// Countries/Entities
	d3.select("#anyCon").property("checked", true);
	d3.selectAll("#conDropdown input").property("checked", false);

	// Codes
	d3.select("#anyCodes").property("checked", true);
	d3.selectAll("#codesCheckboxes input").property("checked", false);

	let event = new Event("change");
	eventHandler.dispatchEvent(event);
}

////////////////////////////////////////////////////////////////////////////////
// Selecting and Viewing Individual Agreements
////////////////////////////////////////////////////////////////////////////////

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
			agt = d; //highlight new one
			agtDetails(agt); // display infobox
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

// Update agreement info box
function agtDetails(d) {
	if (d == null) {
		//clear
		var infoString =
			"<i>Hover over or click timeline and map elements to view details of the agreements they represent.</i>";
	} else {
		var infoString =
			"<b>" +
			d.title +
			"</b><br>" +
			'<a class="button" href="https://www.peaceagreements.org/masterdocument/' +
			d.id +
			'" target = "_blank">Open PDF</a>&nbsp;<a class="button" href="' +
			"https://www.peaceagreements.org/view/" +
			d.id +
			'" target = "_blank">View Coding Detail</a>' +
			"<table><tr><td>Date Signed:</td><td>" +
			formatDate(d.date) +
			"</td></tr><tr><td>Country/Entity:</td><td>" +
			printArray(d.con) +
			"</td></tr><tr><td>Process:</td><td>" +
			d.process +
			"</td></tr><tr><td>Status:</td><td>" +
			d.status +
			"</td></tr><tr><td>Type:</td><td>" +
			agreementTypes[d.type] +
			"</td></tr><tr><td>Stage:</td><td>" +
			stagesLong[d.stage] +
			"</td></tr><tr><td>Sub-Stage:</td><td>" +
			substagesLong[d.substage] +
			"</td></tr></table>";
	}
	d3.select("#agreementDetails").html(infoString);
}

////////////////////////////////////////////////////////////////////////////////
// Other Helper Functions
////////////////////////////////////////////////////////////////////////////////

// D3 Selection Helpers
// Source: https://github.com/wbkd/d3-extended
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

d3.selection.prototype.first = function() {
	return d3.select(this.nodes()[0]);
};

d3.selection.prototype.last = function() {
	return d3.select(this.nodes()[this.size() - 1]);
};

// Parse transform attribute
// Source: https://stackoverflow.com/questions/17824145/parse-svg-transform-attribute-with-javascript
function parseTransform(a) {
	var b = {};
	for (var i in (a = a.match(/(\w+\((\-?\d+\.?\d*e?\-?\d*,?)+\))+/g))) {
		var c = a[i].match(/[\w\.\-]+/g);
		b[c.shift()] = c;
	}
	return b;
}

// Pretty-print an array
function printArray(arr) {
	var str = "";
	arr.forEach(function(d) {
		str = str + d + ", ";
	});
	str = str.slice(0, str.length - 2);
	return str;
}

// Tally an array
function tally(arr) {
	var counts = {};
	var len = arr.length;
	var i;
	for (i = 0; i < len; i++) {
		var num = arr[i];
		counts[num] = counts[num] ? counts[num] + 1 : 1;
	}
	return counts;
}
