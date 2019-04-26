function outer(num, word) {
  function inner(word) {
    for (let i = 0; i < num; i++) {
      console.log(word);
    }
  }
  inner(word);
  return inner;
}

let test = outer(2, 'two');

test('2');

test = outer(6, 'six');
test('6');
