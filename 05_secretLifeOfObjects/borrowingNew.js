let map = {one: true, two: true, hasOwnProperty: true};

// Fix this call
// you can set the `this` of a function by using the .call method. refered to as binding.
console.log(Object.prototype.hasOwnProperty.call(map, 'one'));
// → true
