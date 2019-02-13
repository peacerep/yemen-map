// Date parsers & formatters
var parseDate = d3.timeParse("%d/%m/%Y");
var parseMonth = d3.timeParse("%m");
var parseYear = d3.timeParse("%Y");
var parseDay = d3.timeParse("%j");
var formatDate = d3.timeFormat("%d %B %Y");
var formatMonth = d3.timeFormat("%m");
var formatDay = d3.timeFormat("%j");  // day of the year as decimal number
var formatYear = d3.timeFormat("%Y");

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