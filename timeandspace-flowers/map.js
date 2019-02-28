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

var arc = d3.arc()
	.innerRadius(0)
	.outerRadius(5)


function combineDataPoly(data, world) {

	// filter for intra agreements only
	var data_intra = data.filter(function(d) {
		return d.Agtp == 'Intra'
	})

	// nest by the first country on the list
	data_intra = d3.group(data_intra, d => d.Con[0])

	var newData = []

	for (const [con, agts] of data_intra.entries()) {

		var cen = world.features.find(function(d) {return d.properties.name == con})
		
		if (cen != undefined) {

			// bounding box in lat/lon
			var bbox = d3.geoBounds(cen.geometry)

			// array for random points
			var pts = []
			
			for (var i = 0; i<1000; i++) {
				// bbox: [[left, bottom],[right, top]]
				// point has to be [lon, lat]
				var randomPoint = [bbox[0][0] + Math.random() * (bbox[1][0] - bbox[0][0]),
								   bbox[0][1] + Math.random() * (bbox[1][1] - bbox[0][1])]

				var contained = d3.geoContains(cen.geometry, randomPoint)

				if (contained) { pts.push(randomPoint) }
				if (pts.length == agts.length) { break; }
			}

			// log warning if there are not enough points
			if (pts.length < agts.length) {
				console.log('WARNING! In ' + i + ' iterations, \
				not enough points could be generated for ' + con, pts)
			}

			// create one long list of all agreements
			newData.push(...agts.map(function(d,i) { d.loc = pts[i]; return d }))

		}
		else {console.log(con + ' cannot be found on the map')}
	}

	return newData

}

function updateGlyphs(locdata) {
	// draw glyphs onto dotG

	// get current bounding box (in lat lon)
	var bbox = getBoundingBox();

	// filter data for the visible dots only, also filter out undef ones
	var locdata = locdata.filter(function(d) {
		return filterBBox(bbox, d.loc)
	})

	dotG.selectAll('*').remove()

	// add new ones
	var circle = dotG.selectAll('g')
		.data(locdata)
		.enter()
		.append("g")
		.classed("glyph", true)
		// .merge(circle)
		.attr('transform', function(d) {
			var pos = projection(d.loc)
			return 'translate(' + pos[0] + ',' + pos[1] + ')'
		})

	circle.selectAll('.arc')
		.data(function(d) {
			var activeCodes = []
			for (var i = 0; i < codes.length; i++) {
				if (d[codes[i]]) {
					activeCodes.push(codes[i])
				}
			}
			if (!activeCodes.length) {
				return {startAngle: 0,
					endAngle: tau,
					colour: '#fff'}
			} else {
				var incr = tau / activeCodes.length;
				var obj = []
				for (var i=0; i<activeCodes.length; i++) {
					obj.push({
						startAngle: i * incr,
						endAngle: (i+1) * incr,
						colour: codeColour(activeCodes[i])
					})
				}
				return obj
			}
		})
		.enter()
		.append('path')
		.attr('d', arc)
		.style('fill', d => d.colour)

// var pathData = arcGenerator({
//   startAngle: 0,
//   endAngle: 0.25 * Math.PI,
//   innerRadius: 50,
//   outerRadius: 100
// });

		
		// .attr('cx', d => d.x)
		// .attr('cy', d => d.y)
		// .attr('r', d => d.r)
		// .style('fill', '#11C2F9')
		// .style('fill-opacity', 0.7)
		// .on('mouseover', function(d) {
		// 	agtDetails(d)
		// })

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

