// We’ve seen that
//  %
// (the remainder operator) can be used to test whether a
// number is even or odd by using
// % 2
// to see whether it’s divisible by two. Here’s
// another way to define whether a positive whole number is even or odd:
// 
// • Zero is even.
// • One is odd.
// • For any other number N , its evenness is the same as N - 2.
// Define a recursive function isEven corresponding to this description. The function should accept a single parameter (a positive, whole number) and return a Boolean. Test it on 50 and 75. See how it behaves on -1. Why? Can you think of a way to fix this?


const isEven = n => {

	console.log(n);
	
	if (n === 0) {
		return true;
	} else if (n === 1) {
		return false;
	} else {
		if (n < 0) {
			return isEven(n + 2);
		} else {
			return isEven(n - 2);
		}
		
	}
};


const test = (f,x) => {
	console.log(`it is ${f(x)} that ${x} is even.`);
};

// it is faster but breaks with -1, like the chapter says more eficient but getting unwieldy.

const evenFaster = n => {
	let x = n - 2;
	n = n - x;
	
	console.log(n);

	if (n === 0) {
		return true;
	} else if (n === 1) {
		return false;
	} else {
		if (n < 0) {
			return isEven(n + 2);
		} else {
			return isEven(n - 2);
		}
		
	}
}


test(isEven,2);
test(evenFaster,2);
test(isEven,1);
test(evenFaster,1);
test(isEven,50);
test(evenFaster,50);
test(isEven,75);
test(evenFaster,75);
test(isEven-1);
test(evenFaster-1);
