let {run, topScope} = require('./eggLang.js');

// Add support for arrays to Egg by adding the following three functions to the top scope: array(...values) to construct an array containing the argument values, length(array) to get an array’s length, and element(array, n) to fetch the nth element from an array.

// Modify these definitions...

topScope.array = (...values) => {
  return values;
};

topScope.length = array => {
  return array.length;
};

topScope.element = (array, n) => {
  return array[n];
};

run(`
do(define(sum, fun(array,
     do(define(i, 0),
        define(sum, 0),
        while(<(i, length(array)),
          do(define(sum, +(sum, element(array, i))),
             define(i, +(i, 1)))),
        sum))),
   print(sum(array(1, 2, 3))))
`);
// → 6
