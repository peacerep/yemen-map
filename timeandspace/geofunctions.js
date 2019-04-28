"use strict";

function makeDotmapData(data, world) {
	// get all unique Con values
	var cons = data.map(d => d.con);
	cons = cons.reduce((acc, val) => acc.concat(val));

	cons = tally(cons);

	var newData = [];

	for (const [con, count] of Object.entries(cons)) {
		var cen = world.features.find(d => d.properties.name === con);

		// Palestine and Kurdistan are not internationally recognised and therefore not on the map
		// place them at their approximate location/within the recognised country
		if (con == "Palestine") {
			cen = world.features.find(d => d.properties.name === "Israel");
		}
		if (con == "Kurds-Kurdistan") {
			cen = world.features.find(d => d.properties.name === "Iraq");
		}

		if (cen != undefined) {
			var pts = randomGeoPoints(cen.geometry, count);
			var dat = data.filter(function(d) {
				return d.con.indexOf(con) != -1;
			});
			pts.forEach(function(pt, i) {
				dat[i].loc = pt.loc;
			});

			newData.push({
				id: cen.id,
				con: con,
				count: count,
				agts: dat
			});
		} else {
			// console.log(con + ' cannot be found on the map')
		}
	}

	return newData;
}

function drawDotmap(locdata) {
	// draw glyphs onto dotG

	// get current bounding box (in lat lon)
	var bbox = getBoundingBox();

	// filter data for the visible dots only, also filter out undef ones
	// var locdata = locdata.filter(function(d) {
	// 	return filterBBox(bbox, d.loc)
	// })

	dotG.selectAll("*").remove();

	var con = dotG
		.selectAll("g")
		.data(locdata)
		.enter()
		.append("g")
		.attr("id", d => "dots" + d.id);

	var circle = con
		.selectAll("g")
		.data(d => d.agts)
		.enter()
		.append("g")
		.classed("glyphContainer", true)
		.attr(
			"transform",
			d =>
				"translate(" +
				d3.zoomTransform(svg.node()).apply(projection(d.loc)) +
				")"
		);
	circle
		.append("circle")
		.attr("r", rCircle)
		.attr("pointer-events", "none");
}

function randomGeoPoints(geometry, nPoints) {
	// creates a random point in a country as defined by its geometry
	var bbox = d3.geoBounds(geometry);
	var w = bbox[0][0],
		s = bbox[0][1],
		e = bbox[1][0],
		n = bbox[1][1];

	// array for random points
	var pts = [];

	// if the longitude at the west end of the country is larger than at the
	// east end, the country must span across the 180 line
	if (w > e) {
		var prop = [[w, 180], [-180, e]].map(d => d[1] - d[0]);
		var cut = prop[0] / (prop[0] + prop[1]);

		// a while loop would be more elegant but also more dangerous
		for (var i = 0; i < 1000; i++) {
			var rand = Math.random();
			var randLon =
				rand < cut
					? w + rand * d3.sum(prop)
					: -180 + rand * d3.sum(prop) - prop[0];
			var randomPoint = [randLon, s + Math.random() * (n - s)];
			var contained = d3.geoContains(geometry, randomPoint);
			if (contained) {
				pts.push({ loc: randomPoint });
			}
			if (pts.length >= nPoints) {
				break;
			}
		}
	}
	// if this isn't the case it's just regular maths
	else {
		for (var i = 0; i < 1000; i++) {
			var randomPoint = [
				w + Math.random() * (e - w),
				s + Math.random() * (n - s)
			];
			var contained = d3.geoContains(geometry, randomPoint);
			if (contained) {
				pts.push({ loc: randomPoint });
			}
			if (pts.length >= nPoints) {
				break;
			}
		}
	}

	// log warning if there are not enough points
	if (pts.length < nPoints) {
		console.log(
			"WARNING! In " +
				i +
				" iterations, \
			not enough points could be generated for " +
				geometry
		);
	}
	return pts;
}

// HELPERS

function filterBBox(bbox, loc) {
	// check if point at lon/lat is within the visible part of the map
	return (
		loc != undefined &&
		(bbox.l < loc[0] && loc[0] < bbox.r && bbox.b < loc[1] && loc[1] < bbox.t)
	);
}

function getBoundingBox() {
	// computes bounding box of currently visible part of the map in terms of lat/lon

	var mapBounds = mapG.node().getBBox();
	var mapTrans = d3.zoomTransform(svg.node());

	var l = mapTrans.x + mapBounds.x * mapTrans.k;
	var r = l + mapBounds.width * mapTrans.k;
	var t = mapTrans.y + mapBounds.y * mapTrans.k;
	var b = t + mapBounds.height * mapTrans.k;

	// compare to bounds of svg (visible part)
	l = l > 0 ? -180 : projection.invert([0, NaN])[0];
	r = r < w_map ? 180 : projection.invert([w_map, NaN])[0];
	t = t > 0 ? 85 : projection.invert([NaN, 0])[1];
	b = b < h_map ? -85 : projection.invert([NaN, h_map])[1];

	return { l: l, r: r, t: t, b: b };
}
