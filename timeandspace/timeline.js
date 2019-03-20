// maybe split into init and update function
// add filters

function initTimeline(data) {

	var margin = {top: 5, right: 5, bottom: 25, left: 5}, //read clockwise from top
		width = parseInt(d3.select("#timeline-top").style("width"), 10) - margin.left - margin.right,
		height = parseInt(d3.select("#timeline-top").style("height"), 10) - margin.top - margin.bottom,
		agtHeight = 1,
		agtSpacing = 1;

	var g = d3.select('#timeline-top').append('svg')
		.attr('height', height + margin.top + margin.bottom)
		.attr('width', width + margin.left + margin.right)
		.attr('id', 'svg-timeline-top')
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		.attr('id', 'g-timeline-top')

	var years = getYears(data)

	var minDate = parseDate('30/06/' + (years[0] - 1))
	var maxDate = parseDate('30/06/' + years[1])

	// create time scale and x axis
	var xScale = d3.scaleTime()
		.domain([minDate,maxDate])  // data space
		.range([0, width]);  // display space

	var xAxis = d3.axisBottom(xScale)
		.tickFormat(d3.timeFormat("%Y"))
		.ticks(d3.timeYear.every(1))
		.tickPadding([5]);

	// draw axis into svg
	g.append("g")
		.attr('transform', 'translate(0, ' + (height + 4) + ')')
		.attr("class","xaxis")
		.call(xAxis);

	// calculate agtWidth
	var agtWidth = (width / (1 + years[1] - years[0])) - agtSpacing;
	
// 	updateTimeline(data, xScale, agtWidth)
// }

// function updateTimeline(data, xScale, agtWidth) {

	// Group agreements by Year (create an array of objects whose key is the
	// year and value is an array of objects (one per agreement))
	var years = d3.nest()
		.key(function(d){ return d.Year; }).sortKeys(d3.ascending)
		.sortValues(function(a,b){ return d3.descending(a.Dat, b.Dat) })
		.entries(data);

	// console.log(years)

	g.selectAll('rect').remove()

	for (var i = 0; i < years.length; i++) {
				
		var rects = g.selectAll("rect .y" + i)
			.data(years[i].values)
			.enter()
			.append("rect")
			.classed('y' + i, true)
			.attr("x", function(d){ return xScale(parseYear(d.Year)) - (agtWidth/2); })
			.attr("y",function(d,i){ return height - ((agtHeight + agtSpacing) * i) })
			.attr("width", agtWidth)
			.attr("height", agtHeight);

		rects.on("click", function(d) {
			// display infobox permanently (until click somewhere else in svg??)
			if (selectedAgtDetails == d) {
				selectedAgtDetails = null
			} else {
				selectedAgtDetails = d;
			}
			agtDetails(d)
			event.stopPropagation();
		});

		rects.on("mouseover",function(d){
			// display infobox
			agtDetails(d)
		});
		rects.on("mouseout",function(d) {
			// remove infobox
			agtDetails(selectedAgtDetails)
		});

	} // end for loop (years)

	// add count at the top of each bar
	var text = g.append('g')
		.selectAll("text .count")
		.data(years)   //yrCounts format: [Year, yrCount]
		.enter()
		.append("text")
		.attr("class","count")
		.attr("x", function(d){ return xScale(parseYear(d.key)) })
		.attr("y", function(d){ return height - (d.values.length * (agtHeight + agtSpacing)) })
		.text(function(d){ return d.values.length; })
}