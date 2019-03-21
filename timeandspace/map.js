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
var scaleInit = h/(2*Math.PI) * 1.7
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
	.outerRadius(15)
	.cornerRadius(5)

// set up zoom
var zoom = d3.zoom()
	.scaleExtent([1,15])
	.on("zoom", zooming)
	.on("end", zoomEnd)

svg.call(zoom)

function zooming() {
	// keep stroke-width constant at different zoom levels
	mapG.style("stroke-width", 1 / d3.event.transform.k + "px");
	// zoom map
	mapG.attr("transform", d3.event.transform);
	// semantic zoom flowers
	dotG.selectAll('g').attr("transform", function(d) {
		// console.log(projection(d.loc), d3.event.transform, d3.event.transform.apply(projection(d.loc)))
		return 'translate(' + d3.event.transform.apply(projection(d.loc)) + ')';		
	});
}

function zoomEnd() {
	// update projection
	// projection
	// .translate([d3.event.transform.x + d3.event.transform.k*transInit[0], d3.event.transform.y + d3.event.transform.k*transInit[1]])
	// .scale(d3.event.transform.k * scaleInit)
}

// buttons for zoom
var zoomG = svg.append('g')
	.attr('transform', 'translate(' + (w-35) + ',' + (h-60) + ')')

zoomG.append('rect')
	.attr('x', 0)
	.attr('y', 0)
	.attr('width', 25)
	.attr('height', 25)
	.style('fill', '#fff')
	.style('stroke', '#000')
	.style('stroke-width', '#1px')
	.on('mouseover', function() {
		d3.select(this).style('fill', '#ccc')
	})
	.on('mouseout', function() {
		d3.select(this).style('fill', '#fff')
	})
	.on('click', function() {
		// zoom in
		zoom.scaleBy(svg.transition().duration(200), 1.3)
	})

zoomG.append('rect')
	.attr('x', 0)
	.attr('y', 25)
	.attr('width', 25)
	.attr('height', 25)
	.style('fill', '#fff')
	.style('stroke', '#000')
	.style('stroke-width', '#1px')
	.on('mouseover', function() {
		d3.select(this).style('fill', '#ccc')
	})
	.on('mouseout', function() {
		d3.select(this).style('fill', '#fff')
	})
	.on('click', function() {
		zoom.scaleBy(svg.transition().duration(200), 1/1.3)
		// zoom out
	})

// plus sign
zoomG.append('line')
	.attr('x1', 7.5).attr('x2', 17.5)
	.attr('y1', 12.5).attr('y2', 12.5)
	.style('stroke', '#000').attr('stroke-width', '2px')
	.attr('pointer-events', 'none')

zoomG.append('line')
	.attr('x1', 12.5).attr('x2', 12.5)
	.attr('y1', 7.5).attr('y2', 17.5)
	.style('stroke', '#000').attr('stroke-width', '2px')
	.attr('pointer-events', 'none')

// minus sign
zoomG.append('line')
	.attr('x1', 7.5).attr('x2', 17.5)
	.attr('y1', 37.5).attr('y2', 37.5)
	.style('stroke', '#000').attr('stroke-width', '2px')
	.attr('pointer-events', 'none')


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
		.attr('id', d => 'glyph' + d.AgtId)
		// .merge(circle)
		.attr('transform', function(d) {
			return 'translate(' + d3.zoomTransform(svg.node()).apply(projection(d.loc)) + ')';
		})
	
	circle.append('circle')
		.attr('cx', 0)
		.attr('cy', 0)
		.attr('r', rCircle)
		.style('fill', fillCircle)
		.style('fill-opacity', 1)

	circle.selectAll('.arc')
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

	circle.on("click", function(d) {
		selectedAgt.set(d)
		event.stopPropagation();
	})
	.on("mouseover", onmouseover)
	.on("mouseout", onmouseout)

	return circle
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


