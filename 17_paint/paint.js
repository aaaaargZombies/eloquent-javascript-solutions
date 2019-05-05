var Picture = class Picture {
  constructor(width, height, pixels) {
    this.width = width;
    this.height = height;
    this.pixels = pixels;
  }
  static empty(width, height, color) {
    let pixels = new Array(width * height).fill(color);
    return new Picture(width, height, pixels);
  }
  pixel(x, y) {
    return this.pixels[x + y * this.width];
  }
  draw(pixels) {
    let copy = this.pixels.slice();
    for (let {x, y, color} of pixels) {
      copy[x + y * this.width] = color;
    }
    return new Picture(this.width, this.height, copy);
  }
};

function updateState(state, action) {
  return Object.assign({}, state, action);
}

function elt(type, props, ...children) {
  let dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  for (let child of children) {
    if (typeof child != 'string') dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
  }
  return dom;
}

var scale = 10;

// # Efficient drawing

// During drawing, the majority of work that our application does happens in drawPicture. Creating a new state and updating the rest of the DOM isn’t very expensive, but repainting all the pixels on the canvas is quite a bit of work.

// Find a way to make the syncState method of PictureCanvas faster by redrawing only the pixels that actually changed.

// Remember that drawPicture is also used by the save button, so if you change it, either make sure the changes don’t break the old use or create a new version with a different name.

// Also note that changing the size of a <canvas> element, by setting its width or height properties, clears it, making it entirely transparent again.

var PictureCanvas = class PictureCanvas {
  constructor(picture, pointerDown) {
    this.dom = elt('canvas', {
      onmousedown: event => this.mouse(event, pointerDown),
      ontouchstart: event => this.touch(event, pointerDown),
    });
    this.syncState(picture);
  }
  syncState(picture) {
    if (this.picture == picture) return;

    let oldPicture;
    if ('picture' in this) {
      let oldPicture = this.picture;
    }

    this.picture = picture;
    drawPicture(this.picture, this.dom, scale, oldPicture);
  }
};

function drawPicture(picture, canvas, scale, oldPicture) {
  canvas.width = picture.width * scale;
  canvas.height = picture.height * scale;
  let cx = canvas.getContext('2d');
  if (oldPicture) {
    for (let y = 0; y < picture.height; y++) {
      for (let x = 0; x < picture.width; x++) {
        if (picture.pixel(x, y) != oldPicture.pixel(x, y)) {
          cx.fillStyle = picture.pixel(x, y);
          cx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    }
  } else {
    for (let y = 0; y < picture.height; y++) {
      for (let x = 0; x < picture.width; x++) {
        cx.fillStyle = picture.pixel(x, y);
        cx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }
}

PictureCanvas.prototype.mouse = function(downEvent, onDown) {
  if (downEvent.button != 0) return;
  let pos = pointerPosition(downEvent, this.dom);
  let onMove = onDown(pos);
  if (!onMove) return;
  let move = moveEvent => {
    if (moveEvent.buttons == 0) {
      this.dom.removeEventListener('mousemove', move);
    } else {
      let newPos = pointerPosition(moveEvent, this.dom);
      if (newPos.x == pos.x && newPos.y == pos.y) return;
      pos = newPos;
      onMove(newPos);
    }
  };
  this.dom.addEventListener('mousemove', move);
};

function pointerPosition(pos, domNode) {
  let rect = domNode.getBoundingClientRect();
  return {
    x: Math.floor((pos.clientX - rect.left) / scale),
    y: Math.floor((pos.clientY - rect.top) / scale),
  };
}

PictureCanvas.prototype.touch = function(startEvent, onDown) {
  let pos = pointerPosition(startEvent.touches[0], this.dom);
  let onMove = onDown(pos);
  startEvent.preventDefault();
  if (!onMove) return;
  let move = moveEvent => {
    let newPos = pointerPosition(moveEvent.touches[0], this.dom);
    if (newPos.x == pos.x && newPos.y == pos.y) return;
    pos = newPos;
    onMove(newPos);
  };
  let end = () => {
    this.dom.removeEventListener('touchmove', move);
    this.dom.removeEventListener('touchend', end);
  };
  this.dom.addEventListener('touchmove', move);
  this.dom.addEventListener('touchend', end);
};
/*

# Keyboard bindings

Add keyboard shortcuts to the application. The first letter of a tool’s name selects the tool, and control-Z or command-Z activates undo.

Do this by modifying the PixelEditor component. Add a tabIndex property of 0 to the wrapping <div> element so that it can receive keyboard focus. Note that the property corresponding to the tabindex attribute is called tabIndex, with a capital I, and our elt function expects property names. Register the key event handlers directly on that element. This means you have to click, touch, or tab to the application before you can interact with it with the keyboard.

Remember that keyboard events have ctrlKey and metaKey (for the command key on Mac) properties that you can use to see whether those keys are held down.

*/

var PixelEditor = class PixelEditor {
  constructor(state, config) {
    let {tools, controls, dispatch} = config;
    this.state = state;

    this.canvas = new PictureCanvas(state.picture, pos => {
      let tool = tools[this.state.tool];
      let onMove = tool(pos, this.state, dispatch);
      if (onMove) return pos => onMove(pos, this.state);
    });
    this.controls = controls.map(Control => new Control(state, config));
    this.dom = elt(
      'div',
      {
        tabIndex: 0,
        onkeyup: event => {
          if (
            (event.ctrlKey == true || event.metaKey == true) &&
            event.key == 'z'
          ) {
            event.preventDefault();
            dispatch({undo: true});
            return;
          } else if (!event.ctrlKey && !event.metaKey && !event.altKey) {
            let toolList = Object.keys(tools);
            toolList.forEach(t => {
              if (event.key == t[0]) {
                event.preventDefault();
                dispatch({tool: t});
                return;
              }
            });
          }
        },
      },
      this.canvas.dom,
      elt('br'),
      ...this.controls.reduce((a, c) => a.concat(' ', c.dom), []),
    );
  }
  syncState(state) {
    this.state = state;
    this.canvas.syncState(state.picture);
    for (let ctrl of this.controls) ctrl.syncState(state);
  }
};

var ToolSelect = class ToolSelect {
  constructor(state, {tools, dispatch}) {
    this.select = elt(
      'select',
      {
        onchange: () => dispatch({tool: this.select.value}),
      },
      ...Object.keys(tools).map(name =>
        elt(
          'option',
          {
            selected: name == state.tool,
          },
          name,
        ),
      ),
    );
    this.dom = elt('label', null, '🖌 Tool: ', this.select);
  }
  syncState(state) {
    this.select.value = state.tool;
  }
};
var ColorSelect = class ColorSelect {
  constructor(state, {dispatch}) {
    this.input = elt('input', {
      type: 'color',
      value: state.color,
      onchange: () => dispatch({color: this.input.value}),
    });
    this.dom = elt('label', null, '🎨 Color: ', this.input);
  }
  syncState(state) {
    this.input.value = state.color;
  }
}; /*
 Proper lines 

This is a more advanced exercise than the preceding two, and it will require you to design a solution to a nontrivial problem. Make sure you have plenty of time and patience before starting to work on this exercise, and do not get discouraged by initial failures. 

 On most browsers, when you select the draw tool and quickly drag across the picture, you don’t get a closed line. Rather, you get dots with gaps between them because the "mousemove" or "touchmove" events did not fire quickly enough to hit every pixel. 

 Improve the draw tool to make it draw a full line. This means you have to make the motion handler function remember the previous position and connect that to the current one. 

 To do this, since the pixels can be an arbitrary distance apart, you’ll have to write a general line drawing function. 

 	A line between two pixels is a connected chain of pixels, as straight as possible, going from the start to the end. Diagonally adjacent pixels count as a connected. So a slanted line should look like the picture on the left, not the picture on the right. 

 	Finally, if we have code that draws a line between two arbitrary points, we might as well use it to also define a line tool, which draws a straight line between the start and end of a drag. 

 	 N O T E S 

 	 * can't draw diagonal squares, can only make 90 degree movements 
 	 * that gives 4 posibilites 
 	 * use pythagoras to determin which move brings you closer to the goal 
 	 * write a path finding algorithm based on these points.


	P R O B L E M S

	For some reason it doesn't like drawing straight lines, i assume the while look doesn't finish and it has to wait dispatch. 

	Also, WTF after getting this working bar the straight line things I looked at the hints and the authors solution. It doesn't draw a propper line it looks just like the one in the bad picture. 

	Fixed it, switched the while condition to an || instead of an && which makes alot of sense thinking about it. 

	drawing a fast circle is still a bit pants. Maybe the while loop slows the function from returning so the next time drawPixel is called its too far around the curve to have enough reference points.

*/
function draw2(start, state, dispatch) {
  function drawPixel(pos, state) {
    let drawn = [{x: start.x, y: start.y, color: state.color}];
    while (start.x != pos.x || start.y != pos.y) {
      console.log({start, pos});
      // generate vecs from start
      // test each vec
      // assign best one to start
      start = [
        {x: start.x, y: start.y - 1},
        {x: start.x + 1, y: start.y},
        {x: start.x, y: start.y + 1},
        {x: start.x - 1, y: start.y},
      ].reduce((a, b) => {
        return pythagoras(a, pos) < pythagoras(b, pos) ? a : b;
      });
      drawn.push({x: start.x, y: start.y, color: state.color});
    }
    dispatch({picture: state.picture.draw(drawn)});
    console.log('DISPATCHED');
  }
  drawPixel(start, state);
  return drawPixel;
}
function draw(pos, state, dispatch) {
  function drawPixel({x, y}, state) {
    let drawn = {x, y, color: state.color};
    dispatch({picture: state.picture.draw([drawn])});
  }
  drawPixel(pos, state);
  return drawPixel;
}
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
/*
		Circles   

	Define a tool called circle that draws a filled circle when you drag. The center of the circle lies at the point where the drag or touch gesture starts, and its radius is determined by the distance dragged.

*/ function circle(
  start,
  state,
  dispatch,
) {
  // Your code here
  function drawCircle(pos) {
    let radius = Math.floor(pythagoras(start, pos));
    let drawn = [];
    for (let y = start.y - radius; y <= start.y + radius; y++) {
      for (let x = start.x - radius; x <= start.x + radius; x++) {
        if (
          pythagoras(start, {x, y}) <= radius &&
          x >= 0 &&
          y >= 0 &&
          x < state.picture.width &&
          y < state.picture.height
        ) {
          drawn.push({x, y, color: state.color});
        }
      }
    }
    dispatch({picture: state.picture.draw(drawn)});
  }
  drawCircle(start);
  return drawCircle;
}
var around = [{dx: -1, dy: 0}, {dx: 1, dy: 0}, {dx: 0, dy: -1}, {dx: 0, dy: 1}];
function fill({x, y}, state, dispatch) {
  let targetColor = state.picture.pixel(x, y);
  let drawn = [{x, y, color: state.color}];
  for (let done = 0; done < drawn.length; done++) {
    for (let {dx, dy} of around) {
      let x = drawn[done].x + dx,
        y = drawn[done].y + dy;
      if (
        x >= 0 &&
        x < state.picture.width &&
        y >= 0 &&
        y < state.picture.height &&
        state.picture.pixel(x, y) == targetColor &&
        !drawn.some(p => p.x == x && p.y == y)
      ) {
        drawn.push({x, y, color: state.color});
      }
    }
  }
  dispatch({picture: state.picture.draw(drawn)});
}
function pick(pos, state, dispatch) {
  dispatch({color: state.picture.pixel(pos.x, pos.y)});
}
var SaveButton = class SaveButton {
  constructor(state) {
    this.picture = state.picture;
    this.dom = elt(
      'button',
      {
        onclick: () => this.save(),
      },
      '💾 Save',
    );
  }
  save() {
    let canvas = elt('canvas');
    drawPicture(this.picture, canvas, 1);
    let link = elt('a', {
      href: canvas.toDataURL(),
      download: 'pixelart.png',
    });
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  syncState(state) {
    this.picture = state.picture;
  }
};
var LoadButton = class LoadButton {
  constructor(_, {dispatch}) {
    this.dom = elt(
      'button',
      {
        onclick: () => startLoad(dispatch),
      },
      '📁 Load',
    );
  }
  syncState() {}
};
function startLoad(dispatch) {
  let input = elt('input', {
    type: 'file',
    onchange: () => finishLoad(input.files[0], dispatch),
  });
  document.body.appendChild(input);
  input.click();
  input.remove();
}
function finishLoad(file, dispatch) {
  if (file == null) return;
  let reader = new FileReader();
  reader.addEventListener('load', () => {
    let image = elt('img', {
      onload: () =>
        dispatch({
          picture: pictureFromImage(image),
        }),
      src: reader.result,
    });
  });
  reader.readAsDataURL(file);
}
function pictureFromImage(image) {
  let width = Math.min(100, image.width);
  let height = Math.min(100, image.height);
  let canvas = elt('canvas', {width, height});
  let cx = canvas.getContext('2d');
  cx.drawImage(image, 0, 0);
  let pixels = [];
  let {data} = cx.getImageData(0, 0, width, height);
  function hex(n) {
    return n.toString(16).padStart(2, '0');
  }
  for (let i = 0; i < data.length; i += 4) {
    let [r, g, b] = data.slice(i, i + 3);
    pixels.push('#' + hex(r) + hex(g) + hex(b));
  }
  return new Picture(width, height, pixels);
}
function historyUpdateState(state, action) {
  if (action.undo == true) {
    if (state.done.length == 0) return state;
    return Object.assign({}, state, {
      picture: state.done[0],
      done: state.done.slice(1),
      doneAt: 0,
    });
  } else if (action.picture && state.doneAt < Date.now() - 1000) {
    return Object.assign({}, state, action, {
      done: [state.picture, ...state.done],
      doneAt: Date.now(),
    });
  } else {
    return Object.assign({}, state, action);
  }
}
var UndoButton = class UndoButton {
  constructor(state, {dispatch}) {
    this.dom = elt(
      'button',
      {
        onclick: () => dispatch({undo: true}),
        disabled: state.done.length == 0,
      },
      '⮪ Undo',
    );
  }
  syncState(state) {
    this.dom.disabled = state.done.length == 0;
  }
};
var startState = {
  tool: 'draw',
  color: '#000000',
  picture: Picture.empty(60, 30, '#f0f0f0'),
  done: [],
  doneAt: 0,
};
var baseTools = {draw, draw2, fill, rectangle, pick, circle};
var baseControls = [
  ToolSelect,
  ColorSelect,
  SaveButton,
  LoadButton,
  UndoButton,
];
function startPixelEditor({
  state = startState,
  tools = baseTools,
  controls = baseControls,
}) {
  let app = new PixelEditor(state, {
    tools,
    controls,
    dispatch(action) {
      state = historyUpdateState(state, action);
      app.syncState(state);
    },
  });
  return app.dom;
}
function pythagoras(from, to) {
  let x = from.x - to.x;
  let y = from.y - to.y;
  let p = Math.sqrt(x * x + y * y);
  return p;
}
document.querySelector('div').appendChild(startPixelEditor({}));
