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

function combineDataLoc(data, locations) {

	// attach all agreements for a country to the centroid
	// filter for intra agreements only
	var data_intra = data.filter(function(d) {
		return d.Agtp == 'Intra'
	})

	// nest by the first country on the list
	data_intra = d3.group(data_intra, d => d.Con[0])


	// turn into array where [0] = key and [1] = values
	// data_intra = new Array(...data_intra.entries())

	var newData = []

	// add locations and log, then delete the ones where no locations can be found
	for (const [con, agts] of data_intra.entries()) {
		var cen = locations.find(function(d) {
			return d.name == con})
		if (cen != undefined) {
			newData.push({con: con, agts: agts,
				loc: {lat: cen.latitude, lon: cen.longitude}})
			// agts.loc = {lat: cen.latitude, lon: cen.longitude}		
		} 
		// else {
		// 	console.log('no loc for: ', con)
		// 	data_intra.delete(con)
		// }
	}

	
	console.log(newData)

	return newData
}


function updateGlyphs(locdata) {
	// draw glyphs onto dotG

	console.log(locdata)

	var circle_opacity = .8,
		circle_stroke = '#343332',
		circle_color = '#dddcda',
		color_pol = '#f5003d',
		color_polps = '#01557a',
		color_terps = '#fbdd4b',
		color_eps = '#7a56a0',
		color_mps = '#029680',
		color_hrfra = '#f46c38',
		color_gewom = '#59c9df',
		color_tjmech = '#fc96ab';

	// get current bounding box (in lat lon)
	var bbox = getBoundingBox();

	// filter data for the visible dots only
	var locdata = locdata.filter(function(d) {
		return filterBBox(bbox, d.loc.lon, d.loc.lat)
	})

	// var circle = dotG
	// 	.selectAll(".glyph")
	// 	.data(locdata)

	// // remove surplus circles
	// circle.exit().remove()
	dotG.selectAll('*').remove()

	// add new ones
	var circle = dotG.selectAll('g')
		.data(locdata)
		.enter()
		.append("g")
		.classed("glyph", true)
		// .merge(circle)
		.attr('transform', function(d) {
			var pos = projection([d.loc.lon, d.loc.lat])
			return 'translate(' + pos[0] + ',' + pos[1] + ')'
		})

	circle.append('circle')
		.attr('cx', d => d.outercircle.x)
		.attr('cy', d => d.outercircle.y)
		.attr('r',  d => d.outercircle.r)
		.style('fill', 'none')
		.style('stroke', '#bbb')
		.style('stroke-width', '1px')

	var subcircle = circle.selectAll('.subcircle')
		.data(function(d) {return d.agts})
		.enter()
		.append('circle')
		.classed('subcircle', true)
		.attr('cx', d => d.x)
		.attr('cy', d => d.y)
		.attr('r', d => d.r)
		.style('fill', '#11C2F9')
		.style('fill-opacity', 0.7)
		.on('mouseover', function(d) {
			agtDetails(d)
		})

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

function filterBBox(bbox, lon, lat) {
	// check if point at lon/lat is within the visible part of the map
	return (bbox.l < lon && lon < bbox.r && bbox.b < lat && lat < bbox.t)
}