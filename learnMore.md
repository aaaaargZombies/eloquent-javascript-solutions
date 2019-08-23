# Some things that I struggled with

### Problem

- Regex.

### Answer

I have been working on a markDown parser which has helped quite a lot but I have a ways to go!

### Problem

- Proper lines! My pythagoras based solution is horrible and the given answer produces a nice line but doesn't join the dots as it were.
- The code below will only give the number of pixels on the X axis by design and its hard to think of a marker that will allow the insertion of bridging pixels.
- Maybe storing the last pixel value and doing something in relation to that if the Y figure jumps?

```
  let points = [];
  if (Math.abs(from.x - to.x) > Math.abs(from.y - to.y)) {
    if (from.x > to.x) [from, to] = [to, from];
    let slope = (to.y - from.y) / (to.x - from.x);
    console.log({slope});
    for (let {x, y} = from; x <= to.x; x++) {
      points.push({x, y: Math.round(y), color}); // Math.round is the bit that tips it over onto the next line in relation to slope
      y += slope;
      console.log({y});
    }
  } else {
    if (from.y > to.y) [from, to] = [to, from];
    let slope = (to.x - from.x) / (to.y - from.y);
    for (let {x, y} = from; y <= to.y; y++) {
      points.push({x: Math.round(x), y, color});
      x += slope;
    }
  }
  return points;

```

### Answer

- Keep a record of the last pixel and add a new one in if the `+= slope` axis is not the same as the last one.

```
  let points = [];
  let lastPoint;
  if (Math.abs(from.x - to.x) > Math.abs(from.y - to.y)) {
    if (from.x > to.x) [from, to] = [to, from];
    lastPoint = from;
    let slope = (to.y - from.y) / (to.x - from.x);
    for (let {x, y} = from; x <= to.x; x++) {
      points.push({x, y: Math.round(y), color}); // Math.round is the bit that tips it over onto the next line in relation to slope
      if (lastPoint.y != points[points.length - 1].y) {
        // this works from top left to bottom write but no where else. its something.
        points.push({x: lastPoint.x, y: Math.round(y), color});
      }
      lastPoint = {x, y: Math.round(y)};
      y += slope;
    }
  } else {
    if (from.y > to.y) [from, to] = [to, from];
    lastPoint = from;
    let slope = (to.x - from.x) / (to.y - from.y);
    for (let {x, y} = from; y <= to.y; y++) {
      points.push({x: Math.round(x), y, color});
      if (lastPoint.x != points[points.length - 1].x) {
        // this works from top left to bottom write but no where else. its something.
        points.push({x: Math.round(x), y: lastPoint.y, color});
      }
      lastPoint = {x, y: Math.round(y)};
      x += slope;
    }
  }
  return points;
```

### Problem

- Error handling using `try` / `catch` in functions using `async`,`await`.

```

function Promise_all(promises) {
  return new Promise((resolve, reject) => {
    // Your code here.
    if (promises.length == 0) {
      resolve(promises);
    }
    async function resolver(array) {
      let error = 0;
      for (let i = 0; i < promises.length; i++) {
        try {
          array[i] = await promises[i];
          if (array.length == promises.length) {
            resolve(array);
          }
        } catch (e) {
          error = e;
          break;
          // console.log('this is the error: ', e);
        } finally {
          if (error !== 0) {
            reject(error);
          }
        }
      }
    }
    resolver([]);
  });
}

```

### Problem

- is this a closure? What's going on.

```

PictureCanvas.prototype.mouse = function(downEvent, onDown) {
  if (downEvent.button != 0) return;
  let pos = pointerPosition(downEvent, this.dom);
  let onMove = onDown(pos);   // <= declared here...
  if (!onMove) return;
  let move = moveEvent => {
    if (moveEvent.buttons == 0) {
      this.dom.removeEventListener('mousemove', move);
    } else {
      let newPos = pointerPosition(moveEvent, this.dom);
      if (newPos.x == pos.x && newPos.y == pos.y) return;
      pos = newPos;
      onMove(newPos);		// <= then used here but onMove doesn't apear to be a function ???
    }
  };
  this.dom.addEventListener('mousemove', move);
};

```

### Answer

Yes its a closure, I did some fiddling in the node REPL which made me think it wasn't but I must have made a mistake.

See below code

```
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

```

output

```
two
two
2
2
six
six
six
six
six
six
6
6
6
6
6
6

```

### Problem

- At what point is the state set rather than just redrawing from the origional state at the time of click? how is it implemented here?

> An important detail in this implementation is that when dragging, the rectangle is redrawn on the picture from the original state. That way, you can make the rectangle larger and smaller again while creating it, without the intermediate rectangles sticking around in the final picture. This is one of the reasons why immutable picture objects are useful—we’ll see another reason later.

```
function rectangle(start, state, dispatch) {
  function drawRectangle(pos) {
    let xStart = Math.min(start.x, pos.x);
    let yStart = Math.min(start.y, pos.y);
    let xEnd = Math.max(start.x, pos.x);
    let yEnd = Math.max(start.y, pos.y);
    let drawn = [];
    for (let y = yStart; y <= yEnd; y++) {
      for (let x = xStart; x <= xEnd; x++) {
        drawn.push({x, y, color: state.color});
      }
    }
    dispatch({picture: state.picture.draw(drawn)});
  }
  drawRectangle(start);
  return drawRectangle;
}
```

### Answer

So i believe this works because its a closure. `rectangle` gets given to `pictureCanvas.mouse` which then creates a move event. this does `dispatch({picture: state.picture.draw(drawn)});` with the enclosed state each time. so it's not a case of at which point does the official state get updated but more a question of at which point does the official state stop being updated based on the enclosed state. ie when a fresh `rectangle()` function call is made, not when the returned `drawRectangle` function is being used.

My confusion about the closures above is likely what made this difficult to understand.

### Problem

- What are the differences between `PUT` and `POST`?

### Answer

### Problem

- Trigerering the file selection dialog with JS only works under certain conditions.
- It requires 'user interaction' but I don't know exactly what that means.

```
let fileBtn = elt('button', {onclick: () => clickFileInput()}, 'File');

function clickFileInput(){
  let input = elt('input', {type: 'file', onchange: () => uploadImg(link)});
  document.body.appendChild(input);
  input.click();
  input.remove();
}

document.body.appendChild(fileBtn);

```

- Clicking this button and triggering the following function will open the file selection dialog.

```
class SaveBtn {
  constructor() {
    this.dom = elt('button', {onclick: this.change}, 'SAVE');
  }

  change() {
    wiki = new Wiki(new Read(wiki.view.process()), new EditBtn());
    addMissingLinks(wiki.view.links());
    addMissingImgs(wiki.view.imgs());
    updateDOM();

    fetch(document.baseURI, {
      method: 'PUT',
      body: document.documentElement.outerHTML,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }
}

async function addMissingImgs(pageImgs) {
  let serverImgs = await fetch(baseUrl + '?dir');
  serverImgs = await serverImgs.text();
  missingImgs = pageImgs.filter(
    i =>
      !serverImgs.split('\n').includes(i) &&
      i.slice(0, 'http'.length) !== 'http',
  );
  missingImgs.forEach(i => {
    addImg(i);
  });
}
// TODO
function addImg(link) {
  debugger;
  let type = link.split('.')[link.split('.').length - 1];
  console.log({type});
  if (!imgTypes.includes(type)) return;
  let input = elt('input', {type: 'file', onchange: () => uploadImg(link)});
  document.body.appendChild(input);
  input.click();
  input.remove();
}

```

- the `addImg()` function is called as a result of clicking the save button. But it is called in the `forEach` loop, which is 4 calls deep from the button click.
- Is it a question of how deep the call stack is, Could i try and move most of the logic into the `change()` function?
- Or is there some other issue I'm missing?

### Problem

- I don't really understand the `class y extends x` and the `super` keyword. In the react tutorial it seems to cause some issues with `this`.
- If I don't use super, don't use a constructor and use arrow functions I don't seem to nee to bind this. Why?
