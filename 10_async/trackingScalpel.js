async function locateScalpel(nest) {
  // Your code here.
  let locations = network(nest).map(async name => {
    return [ name , 
      await anyStorage(nest, name, `scalpel`)];
	});
  return (await Promise.all(locations)).filter(x => x[0] == x[1])[0][0];
}

// first attempt above based on the chicks example worked but made building the array for comparison alot trickier without 'await'. this didn't follow the bread crumbs at all now I think about it, was it a fluke that it came up with the correct answer?



async function locateScalpel(nest) {
  // Your code here.
  let current = nest.name;
  for(;;){
  	let next = await anyStorage(nest, current, "scalpel");
    if (current == next) return current;
    current = next;
  }

}

// I looked at the answer / hint for this as I was still trying to build one array of names and scalpel locations. my plan looked like this
//
// names[n] == locations[n]
//
// Anyway I wrote out the new 'async/await' version without looking at the answer but seeing as it's essentially the same but simpler than the promise based solution it felt like a cheat.

function locateScalpel2(nest) {
   // Your code here.
   function loop(current) {
   	return anyStorage(nest, current, "scalpel").then(next => {
    if (next == current) return current;
    else return loop(next);
    })
   }
   return loop(nest.name);
}


locateScalpel(bigOak).then(console.log);
locateScalpel2(bigOak).then(console.log);
// → Butcher Shop



// I think the main difficulty I had with this exercise was I hadn't really understood the structure of the data and what anyStorage() took as arguments and produced. I was just sort of smashing in variables and looking at console.logs() and refining from there rather than building a good mental model. 
