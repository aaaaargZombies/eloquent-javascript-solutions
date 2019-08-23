class Group {
  constructor() {
    this.values = [];
  }
  has(value) {
    return this.values.includes(value);
  }
  add(value) {
    if (!this.has(value)) this.values.push(value);
  }
  delete(val) {
    this.values = this.values.filter(v => v !== val);
  }
  static from(array) {
    let g = new Group();
    array.forEach(val => g.add(val));
    return g;
  }
  [Symbol.iterator]() {
    let iterator = {};
    iterator.count = 0;
    iterator.values = this.values;
    iterator.next = function() {
      let value = this.values[this.count];
      let done = value !== undefined ? false : true;
      this.count++;
      return {value, done};
    };
    return iterator;
  }
}

for (let value of Group.from(['a', 'b', 'c'])) {
  console.log(value);
}
// → a
// → b
// → c
