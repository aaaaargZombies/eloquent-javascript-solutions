const range = (start,end,step) => {
	let numRange = [];
	while (start <= end) {
		numRange.push(start);
		start += typeof step === 'number'? step : 1;
	}
	return numRange;
};

const sum = numbers => {
	let total = 0;
	for (let x of numbers) {
		total += x;
	}
	return total;
};


// array methods push, pop, shift, unshift

console.log(`TESTS:\n`)

console.log(`range 1 to 10 = `, range(1,10));
console.log(`range 1 to 10 step 2 = `, range(1,10,2));
// console.log(`range 1 to 10 step -2 = `, range(1,10,-2)); this breaks the crap out of it.
console.log(`range 1 to 10 step 'fish' = `, range(1,10,'fish'));
console.log(`55 = `,sum(range(1, 10)));
