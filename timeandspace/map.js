// get width and height
var w = parseInt(d3.select("#map").style("width"))
var h = parseInt(d3.select("#map").style("height"))

// create svg
var svg = d3.select("#map")
	.append("svg")
	.attr("width", w)
	.attr("height", h);

// initial scale and translation (makes mercator projection fit screen)
scaleInit = h/(2*Math.PI) * 1.3
transInit = [w/2, h*0.6]

// define projection
var projection = d3.geoMercator()
	.scale(scaleInit)
	.translate(transInit)

// define path generator
var path = d3.geoPath()
	.projection(projection);

var mapG = svg.append('g').attr('id', 'mapG') // g for the map
var dotG = svg.append('g').attr('id', 'dotG') // g for dots or anything else we plot on top

// load world map geojson
d3.json("../data/world-110m.geojson").then(function(world) {

	mapG
	.append("path")
	.attr("d", path(world))
	.classed("land", true)

	d3.json("../data/paxMapData3_27092018.json").then(function(collection) {

		// initialise zoom
		var zoom = d3.zoom()
			.scaleExtent([1,10])
			.on("start", zoomStart)
			.on("zoom", zooming)
			.on("end", zoomEnd)

		svg.call(zoom)

		function zoomStart() {
			dotG.classed("hidden", true)
		}

		function zooming() {
			// keep stroke-width constant at different zoom levels
			mapG.style("stroke-width", 1.5 / d3.event.transform.k + "px");
			// zoom map
			mapG.attr("transform", d3.event.transform);
			// dotG.attr("transform", d3.event.transform);
		}

		function zoomEnd() {
			// update projection
			projection
			.translate([d3.event.transform.x + d3.event.transform.k*transInit[0], d3.event.transform.y + d3.event.transform.k*transInit[1]])
			.scale(d3.event.transform.k * scaleInit)
			// drawFlowers(collection)
			dotG.classed("hidden", false)

			// re-plot dots
			updateGlyphs(collection)
		}

		// initial display
		updateGlyphs(collection)

	})
	.catch(function(error){
		throw error;
	}) // end data
}).catch(function(error){
	throw error;
}) // end geojson

function updateGlyphs(data) {
	// draw glyphs onto dotG
	console.log(data)

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
	var visible = data.objects.filter(function(d) {
		return filterBBox(bbox, d.circle.coordinates[1], d.circle.coordinates[0])
	})

	// bind new data to circles
	var circle = dotG
		.selectAll(".glyph")
		.data(visible)

	// remove surplus circles
	circle.exit().remove()

	// add new ones
	circle
		.enter()
		.append("circle")
		.classed("glyph", true)
		.merge(circle)
		.attr("cx", function(d) {
			d.loc = projection([d.circle.coordinates[1],
					  d.circle.coordinates[0]])
			return d.loc[0]
		})
		.attr("cy", function(d) {return d.loc[1]})
		.attr("r", 3)
		.attr('fill', circle_color)
		.attr('fill-opacity', circle_opacity)
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