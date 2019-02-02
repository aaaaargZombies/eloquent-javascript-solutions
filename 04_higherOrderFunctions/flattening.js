let array = [[1,2,3],[4,5,6],[7,8]]

console.log(array);
console.log(array.reduce( (a, b) => a.concat(b) ));
// console.log(array.reduce( (a, b) => {a.concat(b)} ));
//
// console.log(array.reduce( (a, b) => {a.concat(b)} ));
//TypeError: Cannot read property 'concat' of undefined
//
// Why does the curly brackets cause this to happen!?!?!

