const arrayToList = array => {
	return {value: array[0], rest: array.length === 1 ? null : arrayToList(array.slice(1))};
};


const listToArray = list => {
	let array = [];
	while (list.rest !== null) {
		array.push(list.value);
		list = list.rest;
	} 
	array.push(list.value);
	return array; 
};


const prepend = (element, list) => {
	return {value: element, rest: list};
};


const nth = (list, number) => {
	return number === 0 ? list.value : nth(list.rest, number - 1);
};


// test

const array = [1,2,3];
const list = {
	value: 1,
	rest: {
		value: 2,
		rest: {
			value: 3,
			rest: null,
		},
	},
};
const prepList = {
	value: 0,
	rest : {
		value: 1,
		rest: {
			value: 2,
			rest: {
				value: 3,
				rest: null,
			},
		},
	},
};

console.log(`Testing arrayToList() \n`);
console.log(`recieved: `, array);
console.log(`expected: `, list);
console.log(`result:   `, arrayToList(array));
console.log(`\n`);

console.log(`Testing listToArray() \n`);
console.log(`recieved: `, list);
console.log(`expected: `, array);
console.log(`result:   `, listToArray(list));
console.log(`\n`);

console.log(`Testing prepend() \n`);
console.log(`recieved: `, 0, list);
console.log(`expected: `, prepList);
console.log(`result:   `, prepend(0,list));
console.log(`\n`);

console.log(`Testing nth() \n`);
console.log(`recieved: `, list, 1);
console.log(`expected: `, 3);
console.log(`result: `, nth(list,2));
