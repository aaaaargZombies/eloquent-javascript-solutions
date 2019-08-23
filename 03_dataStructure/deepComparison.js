const deepEqual = (a, b) => {
  if (typeof a !== typeof b) {
    return false;
  } else if (typeof a === 'object' && typeof b === 'object') {
    // test for null
    if (a === null || b === null) {
      return false;
    }
    // do some recursive shit
    let keysA = Object.keys(a);
    let keysB = Object.keys(b);

    for (let i = 0; 0 < keysA.length; i++) {
      // this will short circuit the loop, this can't work!?
      return deepEqual(a[keysA[i]], b[keysB[i]]);
    }
  } else {
    return a === b;
  }
};

// tests

let obj1 = {
  number: 1,
  string: `long`,
  boooool: true,
};

let obj2 = {
  number: `two`,
  string: `long`,
  booo: `ghost`,
};

let obj3 = {
  number: 1,
  string: `long`,
  boooool: false,
};

let obj = {here: {is: 'an'}, object: 2};
console.log(deepEqual(obj, obj));
// → true
console.log(deepEqual(obj, {here: 1, object: 2}));
// → false
console.log(deepEqual(obj, {here: {is: 'an'}, object: 2}));
// → true

console.log(`deepEqual(5,5) = `, deepEqual(5, 5));
console.log(`deepEqual(2,'two') = `, deepEqual(2, 'two'));
console.log(`deepEqual(obj1,obj1) = `, deepEqual(obj1, obj1));
console.log(`deepEqual(obj1,obj2) = `, deepEqual(obj1, obj2));
console.log(`deepEqual(null,obj1) = `, deepEqual(null, obj1));
console.log(`deepEqual(obj3,obj1) = `, deepEqual(null, obj1));
console.log(deepEqual(obj, {here: {is: 'an'}, object: 2}));
