const everyLoop = (array, funk) => {
	for ( let a of array) {
		if (!funk(a)) {
			return false;
		}
	}
	return true;
};
const everySome = (array, funk) => {
	return !array.some(x => !funk(x));
};

console.log(everyLoop([1,2,3], x => x < 10));
console.log(everyLoop([1,2,3], x => x > 10));
console.log(everySome([1,2,3], x => x < 2));
console.log(everySome([1,2,3], x => x > 10));
