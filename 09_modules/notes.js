// a common js module

const ordinal = require("ordinal");
const {days, months} = require("date-names");

exports.formatDate = function(date, format) {
  return format.replace(/YYYY|M(MMM)?|Do?|dddd/g, tag => {
    if (tag == "YYYY") return date.getFullYear();
    if (tag == "M") return date.getMonth();
    if (tag == "MMMM") return months[date.getMonth()];
    if (tag == "D") return date.getDate();
    if (tag == "Do") return ordinal(date.getDate());
    if (tag == "dddd") return days[date.getDay()];
  });
};

// commonjs basic require function

require.cache = Object.create(null);

function require(name) {
	if (!(name in require.cache)) {
		let code = readFile(name);
		let module = {exports: {}};
		require.cache[name] = module;
		let wrapper = Function("require, exports, module", code);
		wrapper(require, module.exports, module);
		// if the module only has a single interface it will write it to module.exports (arg3.exports in the function above)
		// otherwise to export several values it will add them to exports(arg2 in the function) to create the interface object.
		// 
		// its hard to see whats going on because much of it happens in the in the function body/other file that is being imported
	}
	return require.cache[name].exports;
}

// here is an example from elsewhere in the book

// This makes sure the data is exported in node.js —
// `require('./path/to/scripts.js')` will get you the array.
if (typeof module != "undefined" && module.exports && (typeof window == "undef     ined" || window.exports != exports))
  module.exports = SCRIPTS;
if (typeof global != "undefined" && !global.SCRIPTS)
  global.SCRIPTS = SCRIPTS;


// so then....
require('./path/to/scripts.js');
console.log(SCRIPTS);
// { name: 'Adlam',
//  ranges:
//   [ [ 125184, 125259 ], [ 125264, 125274 ], [ 125278, 125280 ] ],
//  direction: 'rtl',
//  year: 1987,
//  living: true,
//  link:
//   'https://en.wikipedia.org/wiki/Fula_alphabets#Adlam_alphabet' }

