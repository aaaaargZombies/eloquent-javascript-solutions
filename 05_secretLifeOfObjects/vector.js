class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  plus(vectwo) {
    return new Vector(this.x + vectwo.x, this.y + vectwo.y);
  }

  minus(vectwo) {
    return new Vector(this.x - vectwo.x, this.y - vectwo.y);
  }

  get length() {
    // I looked at the answer for this because I didn't really know what was expected, it sounded similar to minus except the answer would be the same but now I see it wanted distance in a straight line. I'd have had to look up how to get that figure anyway as I didn't know how to do it with out a ruler...
    //
    // looking back at this I now realise its just pythagoras a^2 + b^2 = c^2 ,  whoooops.
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}

console.log(new Vector(1, 2).plus(new Vector(2, 3)));
// → Vec{x: 3, y: 5}
console.log(new Vector(1, 2).minus(new Vector(2, 3)));
// → Vec{x: -1, y: -1}
console.log(new Vector(3, 4).length);
// → 5
