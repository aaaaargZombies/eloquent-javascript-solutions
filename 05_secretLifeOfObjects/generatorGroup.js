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
	
	[Symbol.iterator](){
		return new groupIterator(this);
		
	}		
	
	[`x` + `y`](){
		return console.log("this method is named 'xy' because it was named [`x` + `y`] in the class");
	}	

	ab(){
		return console.log("you can evaluate the function name like this 'object[`a` + `b`]'");
	}

};

// class groupIterator {
// 	constructor(group) {
// 		this.count = 0;
// 		this.group = group;
// 	}
// 
// 	next() {
// 		
// 		if (this.count === this.group.items.length) {
// 			return {done: true};
// 		}
// 		
// 		let value = this.group.items[this.count];
// 		this.count++;
// 
// 		return {value, done: false};
// 	}
// 
// };

//Group.prototype[Symbol.iterator] = function() {
//	return new groupIterator(this);
//};

Group.prototype[Symbol.iterator] = function*() {
  for (let i = 0; i < this.items.length; i++) {
    yield this.items[i];
  }
};


for (let value of Group.from(["a", "b", "c"])) {
console.log(value);
}
// → a
// → b
// → c

let g = new Group();

g.xy();
g['a'+'b']();
