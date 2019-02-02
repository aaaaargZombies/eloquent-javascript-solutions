let myMap = new Map();

myMap.set("north", 0);
myMap.set("south", 180);
myMap.set("east", 90);
myMap.set("west", 270);
myMap.set("hasOwnProperty", 9000);

//console.log(myMap.prototype.hasOwnProperty("hasOwnProperty"));
console.log(myMap)
console.log(Object.getPrototypeOf(myMap))
console.log(Object.prototype.hasOwnProperty.call(myMap,'hasOwnProperty'));
console.log(Map.prototype.hasOwnProperty.call(myMap,'hasOwnProperty'));

console.log("");

// this is from the answer...

let map = {one: true, two: true, hasOwnProperty: true};
console.log(map)
console.log(Object.getPrototypeOf(map))
console.log(Object.prototype.hasOwnProperty.call(map, "one"));
console.log(Object.prototype.hasOwnProperty.call(map, "hasOwnProperty"));
// → true
//
//
//  Earlier in the chapter I mentioned that an object's `hasOwnProperty` can be used as a more robust alternative to the `in` operator when you want to ignore the prototype's properties. But what if your map needs to include the word `"hasOwnProperty"`? You won't be able to call that method anymore because the object's own property hides the method value.

// Can you think of a way to call `hasOwnProperty` on an object that has its own property by that name?

// I feel like this question sandbagged me with the mention of a 'map'. the solution was what I first tried but on a plain opject laid out like a map. Why would the authoer choose to do this when he states "using plain objects as maps is dangerous"
//
// How would I solve the problem using an actual Map?
