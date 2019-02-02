class PGroup {
	constructor(items) {
		this.items = items;
	}

	add(value) {
		let newItems = this.items.map(x => x);
		if (!this.has(value)) {
			newItems.push(value);
		}
		return new PGroup(newItems);
	}

	delete(value) {
		let newItems = this.items.filter(x => x !== value);
		return new PGroup(newItems);
	}

	has(value) {
		return this.items.some(x => x === value);
	}

};


PGroup.empty = new PGroup([]);

let a = PGroup.empty.add("a");
//console.log(a);
let ab = a.add("b");
//console.log(ab);
let b = ab.delete("a");
//console.log(b);


console.log('does b have b')
console.log(b.has("b"));
// → true
console.log('does a have b')
console.log(a.has("b"));
// → false
console.log('does b have a')
console.log(b.has("a"));
// → false
