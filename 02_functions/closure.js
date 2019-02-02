const multiplier = (factor) => {
	return number => number * factor;
}

// how does 'number' parameter get asigned in the closure?

let twice = multiplier(2);
let thrice = multiplier(3);

console.log(twice(10));
console.log(thrice(10));
