const SCRIPTS = require(`../../Eloquent-JavaScript/code/scripts.js`);
const testText = '英国的狗说 "woof", 俄罗斯的狗说 "тяв"'

function characterScript(code) {
  for (let script of SCRIPTS) {
    if (script.ranges.some(([from, to]) => {
      return code >= from && code < to;
    })) {
      return script;
    }
  }
  return null;
}

function dominantDirection(text) {
  // Your code here.
	const scores = [...text]
		.map(char => char.codePointAt(0))
		.map(code => characterScript(code))
		.filter(script => script !== null)
		.map(script => script.direction )	
		.reduce((a,b) => {
			if (!a[b]) a[b] = 0;
			a[b]++
			return a
		}, {})
	return Object.keys(scores).reduce((a,b) => scores[a] > scores[b] ? a : b ,)
}

console.log(dominantDirection("Hello!"));
// → ltr
console.log(dominantDirection("Hey, مساء الخير"));
// // → rtl
console.log(dominantDirection(testText));

