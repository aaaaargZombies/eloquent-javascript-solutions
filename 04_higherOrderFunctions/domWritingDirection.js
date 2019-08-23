const SCRIPTS = require(`../../Eloquent-JavaScript/code/scripts.js`);
const testText = '英国的狗说 "woof", 俄罗斯的狗说 "тяв"'

// stolen code

function countBy(items, groupName) {
  let counts = [];
  for (let item of items) {
    let name = groupName(item);
    let known = counts.findIndex(c => c.name == name);
    if (known == -1) {
      counts.push({name, count: 1});
    } else {
      counts[known].count++;
    }
  }
  return counts;
}

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


const domDirection = text => {

  let scripts = countBy(text, char => {
	  let script = characterScript(char.codePointAt(0));
		  return script ? script.name : "none";
		}).filter(({name}) => name != "none");

// end stolen code

 	let largestName = scripts.reduce((a,b) => a.count > b.count ? a: b).name;

  return SCRIPTS.filter(x => x.name === largestName)[0].direction;
  

	// can the above be composed together? yes but its quite hard to read...
	// return SCRIPTS.filter(x => x.name === scripts.reduce((a,b) => a.count > b.count ? a: b).name)[0].direction;

};


console.log(domDirection("Hello!"));
 // → ltr
console.log(domDirection("Hey, ﻢﺳﺍﺀ ﺎﻠﺨﻳﺭ"));
 // → rtl
console.log(domDirection(testText));


