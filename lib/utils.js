// --------------------
// utility functions
// --------------------

// modules
var _ = require('lodash');

// exports
module.exports = {
	// array splice but inserts several elements provided as array, rather than as several arguments
	// e.g. _.spliceArray([1,2,3], 1, 1, [8,9]) => [1,8,9,3]
	// equivalent to [1,2,3].splice(1, 1, 8, 9)
	spliceArray: function(arr, pos, length, replaceArr) {
		var args = _.clone(replaceArr);
		args.unshift(pos, length);
		return arr.splice.apply(arr, args);
	},

	// checks if str ends with needle
	startsWith: function(str, needle) {
		if (str.length < needle.length) return false;
		return str.slice(0, needle.length) == needle;
	},

	// checks if str ends with needle
	endsWith: function(str, needle) {
		if (str.length < needle.length) return false;
		return str.slice(-needle.length) == needle;
	}
};
