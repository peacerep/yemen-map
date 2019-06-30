"use strict";

// define sizes etc
const glyphR = 15; // radius of one glyph on the map
const popupGlyphR = 20; // radius incl margin of one glyph in the popup
var delta = popupGlyphR * 2.1; // distance between glyphs on spiral

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
