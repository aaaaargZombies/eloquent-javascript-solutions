class Group {
	constructor() {
		this.items = [];
	}

	add(value) {
		if (!this.has(value)) {
			this.items.push(value);
		} 
	}

	delete(value) {
		this.items = this.items.filter(x => x !== value);
	}

	has(value) {
		return this.items.some(x => x === value);
	}

	static from(iterableObject) {
		let group = new Group();
		for (let item of iterableObject) {
			group.add(item);
		}
		return group;
	}

};

let group = Group.from([10, 20]);
console.log(group.has(10));
// → true
console.log(group.has(30));
// → false
group.add(10);
group.delete(10);
console.log(group.has(10));

