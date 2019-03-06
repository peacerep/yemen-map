"use strict"

// get width and height
var w = parseInt(d3.select("#map").style("width"))
var h = parseInt(d3.select("#map").style("height"))

// create svg
var svg = d3.select("#map")
	.append("svg")
	.attr("width", w)
	.attr("height", h);

// initial scale and translation (makes mercator projection fit screen)
var scaleInit = h/(2*Math.PI) * 1.3
var transInit = [w/2, h*0.6]

// define projection
var projection = d3.geoMercator()
	.scale(scaleInit)
	.translate(transInit)

// define path generator
var path = d3.geoPath()
	.projection(projection);

var mapG = svg.append('g').attr('id', 'mapG') // g for the map
var dotG = svg.append('g').attr('id', 'dotG') // g for dots or anything else we plot on top

// var summaryR = 10;
var agtR = 15;


var arc = d3.arc()
	.innerRadius(0)
	.outerRadius(agtR)
	.cornerRadius(5)

var summaryR = d3.scalePow()
	.range([5, 30])
	.domain([1,100])


function combineDataPoly(data, world) {

	// filter for intra agreements only
	var data_intra = data.filter(function(d) {
		return d.Agtp == 'Intra'
	})

	// nest by the first country on the list
	data_intra = d3.group(data_intra, d => d.Con[0])
	console.log(data_intra)

	var newData = []

	for (const [con, agts] of data_intra.entries()) {

		var cen = world.features.find(function(d) {return d.properties.name == con})
		
		if (cen == undefined) {console.log(con + ' cannot be found on the map')}
		else {

			// centroid
			var centr = d3.geoCentroid(cen.geometry)

			// circlepacking
			d3.packSiblings(agts.map(function(d) {
							d.r = agtR;
							return d
						}))
			var outercircle = d3.packEnclose(agts)

			// data for summary glyph
			var codePerc = []
			codes.forEach(function(d) {
				codePerc[d] = 0
			})
			for (var i = 0; i < codes.length; i++) {
				for (var j=0; j < agts.length; j++) {
					if (agts[j][codes[i]]) {
						codePerc[codes[i]] += 1
					}
				}
				codePerc[codes[i]] = codePerc[codes[i]] / agts.length;
			}
			// console.log(codePerc)

			newData.push({con: con, 
						agts: agts, 
						centroid: centr, 
						outercircle: outercircle,
						codePerc: codePerc})

		}
	}

	return newData

}

function updateGlyphs(locdata) {

	console.log(locdata)
	// draw glyphs onto dotG

	// get current bounding box (in lat lon)
	var bbox = getBoundingBox();

	// filter data for the visible dots only, also filter out undef ones
	var locdata = locdata.filter(function(d) {
		return filterBBox(bbox, d.centroid)
	})

	dotG.selectAll('*').remove()

	// add new ones
	var gCircle = dotG.selectAll('g')
		.data(locdata)
		.enter()
		.append("g")
		.attr('transform', function(d) {
			var pos = projection(d.centroid)
			return 'translate(' + pos[0] + ',' + pos[1] + ')'
		})
	
	var circle = gCircle.append('circle')
		.attr('cx', 0)
		.attr('cy', 0)
		.attr('r', d => summaryR(d.agts.length))
		.style('fill', '#c4ccd0')

	gCircle.selectAll('.sumGlyph')
		.data(d => d.codePerc)
		.enter()
		.append('path')
		.attr('d', arc)
		.style('fill', d => d.colour)
/////////////////////////


	circle.on('mouseover', function(d) {
		console.log('mouseover', d)
		var g = d3.select(this.parentNode)

		g.moveToFront()

		g.select('circle')
			.transition()
			.duration(500)
			.attr('r', d => d.outercircle.r)
			.style('fill', '#fff')
			.style('fill-opacity', '0.6')
			.transition()

		var glyph = g.selectAll('.glyph')
			.data(d => d.agts)
			.enter()
			.append('g')
			.classed('glyph', true)

		glyph.append('circle')
			.attr('cx', 0)
			.attr('cy', 0)
			.attr('r', d => 0.8 * d.r)
			.attr('fill', '#c4ccd0')

		glyph.selectAll('.arc')
			.data(function(d) {
				var activeCodes = []
				for (var i = 0; i < codes.length; i++) {
					if (d[codes[i]]) {
						activeCodes.push(codes[i])
					}
				}
				if (!activeCodes.length) { return [] } 
				else {
					var incr = tau / codes.length;
					var obj = []
					for (var i=0; i<codes.length; i++) {
						if (activeCodes.includes(codes[i])) {
							obj.push({
							startAngle: i * incr,
							endAngle: (i+1) * incr,
							colour: codeColour(codes[i])
						})
						}
						
					}
					return obj
				}
			})
			.enter()
			.append('path')
			.attr('d', arc)
			.style('fill', d => d.colour)

		glyph.transition()
			.duration(500)
			.attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')


		})
		.on('mouseout', function(d) {
			console.log('mouseout')
			d3.select(this)
				.transition()
				.duration(200)
				.attr('r', d => summaryR(d.agts.length))
				.style('fill', '#c4ccd0')
				.style('fill-opacity', 1)
				.transition()
			d3.select(this.parentNode).selectAll('.glyph')
				// .transition()
				// .duration(500)
				// .attr('transform', 'translate(0,0)')
				.remove()
		})



	// circle.on("click", function(d) {
	// 	// display infobox permanently (until click somewhere else in svg??)
	// 	if (selectedAgtDetails == d) {
	// 		selectedAgtDetails = null
	// 	} else {
	// 		selectedAgtDetails = d;
	// 	}
	// 	agtDetails(d)

	// 	event.stopPropagation();
	// });

	// circle.on("mouseover",function(d){
	// 	// display infobox
	// 	agtDetails(d)
	// 	// arc.outerRadius(25)
	// 	d3.select(this).style('stroke', '#fff').moveToFront()
	// 	// d3.select(this).selectAll('arc').attr('d', d)
	// });
	// circle.on("mouseout",function(d) {
	// 	// remove infobox
	// 	agtDetails(selectedAgtDetails)
	// 	d3.select(this).style('stroke', 'none')
	// });
}

function getBoundingBox() {
	// computes bounding box of currently visible part of the map in terms of lat/lon

	var mapBounds = mapG.node().getBBox()
	var mapTrans = d3.zoomTransform(svg.node())

	var l = mapTrans.x + mapBounds.x * mapTrans.k
	var r = l + mapBounds.width * mapTrans.k
	var t = mapTrans.y + mapBounds.y * mapTrans.k
	var b = t + mapBounds.height * mapTrans.k

	// compare to bounds of svg (visible part)
	l = (l > 0 ? -180 : projection.invert([0, NaN])[0])
	r = (r < w ? 180 : projection.invert([w, NaN])[0])
	t = (t > 0 ? 85 : projection.invert([NaN, 0])[1])
	b = (b < h ? -85 : projection.invert([NaN, h])[1])

	return {l: l, r: r, t: t, b: b}
}

function filterBBox(bbox, loc) {
	// check if point at lon/lat is within the visible part of the map
	return (loc != undefined) && (bbox.l < loc[0] && loc[0] < bbox.r && bbox.b < loc[1] && loc[1] < bbox.t)
}

