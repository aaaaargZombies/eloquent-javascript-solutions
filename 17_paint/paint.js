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
};
function draw(start, state, dispatch) {
  function drawPixel(pos, state) {
    let drawn = [{x: start.x, y: start.y, color: state.color}];
    while (start.x != pos.x || start.y != pos.y) {
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
  }
  drawPixel(start, state);
  return drawPixel;
}
function linePythag(start, state, dispatch) {
  // unexpected terrible results, it turns out that a straight line then a 45 degree line is often the result.
  function drawLine(pos) {
    let drawn = [{x: start.x, y: start.y, color: state.color}];
    let tip = start;
    while (tip.x != pos.x || tip.y != pos.y) {
      tip = [
        {x: tip.x, y: tip.y - 1},
        {x: tip.x + 1, y: tip.y},
        {x: tip.x, y: tip.y + 1},
        {x: tip.x - 1, y: tip.y},
      ].reduce((a, b) => {
        return pythagoras(a, pos) < pythagoras(b, pos) ? a : b;
      });
      drawn.push({x: tip.x, y: tip.y, color: state.color});
    }
    dispatch({picture: state.picture.draw(drawn)});
  }
  drawLine(start);
  return drawLine;
}
function drawLine(from, to, color) {
  //  TODO this is code from the solution, I will come back to try and modify it to solve the poblem
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
}
function line(start, state, dispatch) {
  return end => {
    let line = drawLine(start, end, state.color);
    dispatch({picture: state.picture.draw(line)});
  };
}
function drawOriginal(pos, state, dispatch) {
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
function circle(start, state, dispatch) {
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
  color: '#717171',
  picture: Picture.empty(60, 30, '#f0f0f0'),
  done: [],
  doneAt: 0,
};
var baseTools = {draw, line, linePythag, fill, rectangle, pick, circle};
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
