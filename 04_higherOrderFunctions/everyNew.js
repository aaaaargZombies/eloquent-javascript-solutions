const every = (array, test) => {
  // Your code here.
  for (let i of array) {
    if (!test(i)) return false;
  }
  return true;
};

console.log('every');
console.log(every([1, 3, 5], n => n < 10));
// → true
console.log(every([2, 4, 16], n => n < 10));
// → false
console.log(every([], n => n < 10));
// → true

const everyRecur = (array, test) => {
  if (array.length === 0) return true;
  if (test(array[0])) {
    return everyRecur(array.slice(1), test);
  }
  return false;
};

console.log('everyRecur');
console.log(everyRecur([1, 3, 5], n => n < 10));
// → true
console.log(everyRecur([2, 4, 16], n => n < 10));
// → false
console.log(everyRecur([], n => n < 10));
// → true

console.log('everySome');
const everySome = (array, test) => {
  return !array.some(x => !test(x));
};

console.log(everySome([1, 3, 5], n => n < 10));
// → true
console.log(everySome([2, 4, 16], n => n < 10));
// → false
console.log(everySome([], n => n < 10));
// → true
