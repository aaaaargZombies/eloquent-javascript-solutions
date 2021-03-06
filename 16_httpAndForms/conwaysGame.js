let grid = document.querySelector('#grid');
let nextBtn = document.querySelector('#next');
let gridSizeX = 50;
let gridSizeY = 25;
// a 2d array of booleans representing checked state
let state;

function genGrid(x, y) {
  let form = document.createElement('form');
  for (let i = 0; i < y; i++) {
    let div = document.createElement('div');
    for (let i = 0; i < x; i++) {
      let checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      div.appendChild(checkbox);
    }
    form.appendChild(div);
  }
  grid.appendChild(form);
}

function readDomState() {
  // return a new state based on the dom's state. use when next is clicked
  let checkboxs = [...grid.firstChild.elements];
  let checked = checkboxs.map(x => x.checked);
  let newState = [];

  let startSlice = 0;
  let endSlice = gridSizeX;

  for (let i = 0; i < gridSizeY; i++) {
    // slice up the checked array into rows and add them to newState
    newState.push(checked.slice(startSlice, endSlice));
    startSlice = endSlice;
    endSlice += gridSizeX;
  }

  return newState;
}

function updateState(conditionFunction) {
  //return a new state based on the true or false return value of the supplied function
  let newState = state.map((array, y) => {
    return array.map((i, x) => {
      return conditionFunction(y, x);
    });
  });
  // array.prototype.map() didn't provide a current index... except i just looked at the docs and it does...

  // let newState = [...state];

  // for (let y = 0; y < gridSizeY; y++) {
  //  for (let x = 0; x < gridSizeX; x++) {
  //    newState[y][x] = conditionFunction(y, x);
  //  }
  // }

  return newState;
}

function updateGrid(state) {
  // reads the 2d state array and updates the checkBoxes acordingly
  let checkboxs = [...grid.firstChild.elements];
  let count = 0;
  state.forEach(row => {
    row.forEach(x => {
      checkboxs[count].checked = x;
      count++;
    });
  });
}

// TODO something goes terribly wrong when its not a square
// fixed! it I just flipped the x/y figures when doing the neighbors.
function neighborVecs(y, x) {
  return [
    [y - 1, x - 1],
    [y - 1, x],
    [y - 1, x + 1],
    [y, x - 1],
    [y, x + 1],
    [y + 1, x - 1],
    [y + 1, x],
    [y + 1, x + 1],
  ];
}
function conwaysRules(y, x) {
  const neighbors = neighborVecs(y, x);
  const lives = neighbors
    .map(vec => {
      if (
        vec[0] < 0 ||
        vec[1] < 0 ||
        vec[0] > gridSizeY - 1 ||
        vec[1] > gridSizeX - 1
      )
        return false;
      return state[vec[0]][vec[1]];
    })
    .filter(x => x);

  /*
	R U L E S

	* Any live cell with fewer than two or more than three live neighbors dies.
	* Any live cell with two or three live neighbors lives on to the next generation.
	* Any dead cell with exactly three live neighbors becomes a live cell.
	*/

  if (state[y][x]) {
    return lives.length < 2 || lives.length > 3 ? !state[y][x] : state[y][x];
  } else {
    return lives.length == 3 ? !state[y][x] : state[y][x];
  }
}

genGrid(gridSizeX, gridSizeY);
state = readDomState();
state = updateState((y, x) => {
  if (Math.random() > 0.5) return true;
  return false;
});
updateGrid(state);

nextBtn.addEventListener('click', () => {
  state = readDomState();
  state = updateState(conwaysRules);
  updateGrid(state);
});

// setInterval(() => {
// nextBtn.click();
// }, 500);
