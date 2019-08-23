// Your code here.

const loop = (value, test, update, callBack) => {
  for (let i = value; test(i); i = update(i)) {
    callBack(i);
  }
};

loop(3, n => n > 0, n => n - 1, console.log);
// → 3
// → 2
// → 1

// Your code here.

const loopRecur = (value, test, update, callBack) => {
  if (!test(value)) return;
  callBack(value);
  loopRecur(update(value), test, update, callBack);
};

loopRecur(3, n => n > 0, n => n - 1, console.log);
// → 3
// → 2
// → 1
