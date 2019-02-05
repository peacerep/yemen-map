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

var mapG = svg.append("g")

// load world map geojson
d3.json("../data/world-110m.geojson", function(error, world) {
	if (error) throw error;

	mapG
	.append("path")
	.attr("d", path(world))
	.classed("land", true)
})


	// initialise zoom
	// has to be within recall of dataset because "zooming" function triggers reloading the dots
var zoom = d3.zoom()
	.scaleExtent([1,10])
	.on("start", zoomStart)
	.on("zoom", zooming)
	.on("end", zoomEnd)

svg.call(zoom)

function zoomStart() {}

function zooming() {
	// zoom map
	mapG.style("stroke-width", 1.5 / d3.event.transform.k + "px");
	mapG.attr("transform", d3.event.transform);
}

function zoomEnd() {
	
	// update projection
	projection
	.translate([d3.event.transform.x + d3.event.transform.k*transInit[0], d3.event.transform.y + d3.event.transform.k*transInit[1]])
	.scale(d3.event.transform.k * scaleInit)

}


// function getBoundingBox() {
// 	// computes bounding box of currently visible part of the map in terms of lat/lon

// 	var mapBounds = mapG.node().getBBox()
// 	var mapTrans = d3.zoomTransform(svg.node())

// 	var l = mapTrans.x + mapBounds.x * mapTrans.k
// 	var r = l + mapBounds.width * mapTrans.k
// 	var t = mapTrans.y + mapBounds.y * mapTrans.k
// 	var b = t + mapBounds.height * mapTrans.k

// 	// compare to bounds of svg (visible part)
// 	l = (l > 0 ? -180 : projection.invert([0, NaN])[0])
// 	r = (r < w ? 180 : projection.invert([w, NaN])[0])
// 	t = (t > 0 ? 85 : projection.invert([NaN, 0])[1])
// 	b = (b < h ? -85 : projection.invert([NaN, h])[1])

// 	return {l: l, r: r, t: t, b: b}
// }

