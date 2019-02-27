// I wanted to write both a async await and .then .catch version but I can't figure out how to handle the errors in this one :(

function Promise_all(promises) {
  return new Promise((resolve, reject) => {
    // Your code here.
    if (promises.length == 0) {
      resolve(promises);
    }
    async function resolver(array) {
      let error = 0;
      for (let i = 0; i < promises.length; i++) {
        try {
          array[i] = await promises[i];
          if (array.length == promises.length) {
            resolve(array);
          }
        } catch (e) {
          error = e;
          break;
          // console.log('this is the error: ', e);
        } finally {
          if (error !== 0) {
            reject(error);
          }
        }
      }
    }
    resolver([]);
  });
}

// Test code.
Promise_all([]).then(array => {
  console.log('This should be []:', array);
});
function soon(val) {
  return new Promise(resolve => {
    setTimeout(() => resolve(val), Math.random() * 500);
  });
}
Promise_all([soon(1), soon(2), soon(3)]).then(array => {
  console.log('This should be [1, 2, 3]:', array);
});
Promise_all([soon(1), Promise.reject('X'), soon(3)])
  .then(array => {
    console.log('We should not get here');
  })
  .catch(error => {
    if (error != 'X') {
      console.log('Unexpected failure:', error);
    }
  });
