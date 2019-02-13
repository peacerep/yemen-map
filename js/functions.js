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

// Colour Scales
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

function agtDetails(d) {
	if (d==null) {
		//clear
		var infoString = 'No agreement selected.'
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
	// 	d3.select('#detailsDate').html('')
	// 	d3.select('#detailsCon').html('')
	// 	d3.select('#detailsStatus').html('')
	// 	d3.select('#detailsType').html('')
	// 	d3.select('#detailsStage').html('')
	// 	d3.select('#detailsSubstage').html('')
	// } else {
	// 	// updates agreement details on the left
	// 	d3.select('#detailsTitle').html(d.Agt)
	// 	d3.select('#detailsDate').html(formatDate(d.Dat))
	// 	d3.select('#detailsCon').html(d.Con)
	// 	d3.select('#detailsStatus').html(d.Status)
	// 	d3.select('#detailsType').html(d.Agtp)
	// 	d3.select('#detailsStage').html(d.Stage)
	// 	d3.select('#detailsSubstage').html(d.StageSub)
	// 	d3.select('#detailsLinks').html('<a href="https://www.peaceagreements.org/masterdocument/' + 
	// 		d.AgtId + '" target = "_blank">Open PDF</a>&nbsp;<a href="' + 
	// 		'https://www.peaceagreements.org/view/' + 
	// 		d.AgtId + '" target = "_blank">View Coding Detail</a>')
	// }
}