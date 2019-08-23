// Your code here.

const deepEqual = (a, b) => {
  if (typeof a === 'object' && a !== null) {
    if (typeof b === 'object' && b !== null) {
      let ak = Object.keys(a);
      let bk = Object.keys(b);
      if (ak.length !== bk.length) return false;
      for (let i = 0; i < ak.length; i++) {
        if (!deepEqual(ak[i], bk[i])) return false;
      }
      for (let i = 0; i < ak.length; i++) {
        if (!deepEqual(a[ak[i]], b[bk[i]])) return false;
      }
      return true;
    }
  }
  return a === b;
};

let obj = {here: {is: 'an'}, object: 2};
console.log(deepEqual(obj, obj));
// → true
console.log(deepEqual(obj, {here: 1, object: 2}));
// → false
console.log(deepEqual(obj, {here: {is: 'an'}, object: 2}));
// → true
