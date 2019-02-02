// array methods push, pop, shift, unshift

const reverseArray = array => {
	let yarra = [];
	let count = array.length;
	for (let x = 0; x < count; x++){
		yarra.unshift(array.shift());
	}
	return yarra;
};

const reverseArrayInPlace = array => {
	for (let i = 0; i < (Math.floor(array.length / 2)); i++) {
		let old = array[i]; // had to look at the the answers :( this bit feels a bit like cheating, why not just use the same method as above and then asign the origional array its output?
		array[i] = array[array.length - 1 - i];
		array[array.length - 1 - i] = old;
	array = ['pie', 2]; // this isn't persisting outside of the function!?
	}
};

const sideEffectArray = array => {
	//array = reverseArray(array);
	console.log(array);
	array = ['pie', 2]; // this isn't persisting outside of the function!?
	console.log(array); // turns out you need to alter the values in the array for it to persist outside the scope for some reason ie array[0] will persist but swapping the whole array is a no go. not sure why yet. need to go over imutability again I guess???
};

let test = [1,2,3,4,5];
let test1 = [1,2,3,4,'apple',];

console.log(`TEST: \n`);
console.log(`reverseArray([1,2,3,4,5]) = `, reverseArray([1,2,3,4,5]));
console.log(`reverseArray([1,2,3,4,5,6,7,8,9]) = `, reverseArray([1,2,3,4,5,6,7,8,9]));
console.log(`test = `,test);
reverseArrayInPlace(test);
console.log(`reverseArrayInPlace(test) = `,test);
console.log(`test1 = `,test1 );
sideEffectArray(test1);
console.log('\n');
console.log(`sideEffectArray(test1) = `, test1);

