function Promise_all(promises) {
  return new Promise((resolve, reject) => {
		// Your code here.
		// this is pretty close, need to keep track of whats been done outside of the for loop so it doesn't just charge ahead. 
		// pushing stuff in seems to mess with the order of the aray (because they get pushed in as they resolve) so need some way of fixing the index.
		// array.length is a pain, need to handle it outside the loop because an empty aray is not thenable
		// have to resolve in the last then() to ensure that everything has gone through
		// need to have a catch on each promise in case it goes wrong.
			let array = [];
			let count = promises.length;
			if (count == 0) resolve(promises);
			for (let i = 0; i < promises.length; i++) {
				promises[i].then(x => {
					array[i] = x;
					count--;
					if (count == 0) resolve(array);
				}).catch(reject) 
			}
	});
}

// Test code.
Promise_all([]).then(array => {
  console.log("This should be []:", array);
});
function soon(val) {
  return new Promise(resolve => {
    setTimeout(() => resolve(val), Math.random() * 500);
  });
}
Promise_all([soon(1), soon(2), soon(3)]).then(array => {
  console.log("This should be [1, 2, 3]:", array);
});
Promise_all([soon(1), Promise.reject("X"), soon(3)])
  .then(array => {
    console.log("We should not get here");
  })
  .catch(error => {
    if (error != "X") {
      console.log("Unexpected failure:", error);
    }
  });
