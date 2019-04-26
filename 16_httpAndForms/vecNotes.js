class Matrix {
  constructor(width, height, element = (x, y) => undefined) {
    this.width = width;
    this.height = height;
    this.content = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.content[y * width + x] = element(x, y);
      }
    }
  }

  get(x, y) {
    return this.content[y * this.width + x];
  }
  set(x, y, value) {
    this.content[y * this.width + x] = value;
  }
}

/*
 *	this class explains how to treat a 1d array as a 2d grid.
 *	this is particularly usefull when dealing with an array of DOM elements
 *	that present as a grid when rendered but are more like a list when
 *	accessed by JS
 *
 *	array[y * width + x]
 *
 * */
