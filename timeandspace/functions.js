"use strict";

// define sizes etc
var glyphR = 20; //radius of one glyph including margin
var delta = glyphR * 2.1; // distance between glyphs on spiral

function tally(arr) {
	var counts = {};
	var len = arr.length;
	var i;
	for (i = 0; i < len; i++) {
		var num = arr[i];
		counts[num] = counts[num] ? counts[num] + 1 : 1;
	}
	return counts;
}
