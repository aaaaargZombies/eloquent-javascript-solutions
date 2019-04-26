# Some things that I struggled with

- Regex.

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
