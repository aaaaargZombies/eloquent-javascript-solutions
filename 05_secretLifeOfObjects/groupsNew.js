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
}

let group = Group.from([10, 20]);
console.log(group.has(10));
// → true
console.log(group.has(30));
// → false
group.add(10);
group.delete(10);
console.log(group.has(10));
// → false
