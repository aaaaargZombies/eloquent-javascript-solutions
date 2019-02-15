function resolveAfter2Seconds(x) { 
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}

async function f1() {
	var x = await resolveAfter2Seconds(10);
  console.log(x); // 10
}
f1();

// so 'await' is a bit like 'then()' but you can use it to asign variables in the scope of function rather than the internal function of 'then()'.
//
// perhaps you could do..
//
// resolveAfter2Seconds(10).then(x => console.log(x));
//
// but I guess you couldn't keep working on the variable because it would be a new promise after you use 'then()'
//
// if you did;
//
// let x;
// resolveAfter2Seconds(10).then(a => x = a);
// 
// you could keep the value of that one promise but when you wrote
//
// console.log(x);
//
// it'd run too soon. 
//
// bummer.
//
// Reading slightly later in the chapter in 'event loop', the problem 'async/await' solves is not pulling these functions out of their context or place in the call-stack.

