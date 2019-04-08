let grid = document.querySelector('#grid');
let nextBtn = document.querySelector('#next');
let gridSizeX = 50;
let gridSizeY = 25;
// a 2d array of booleans representing checked state
let state;

// todo some way to derive a vector from an item in the state
//		-> the outer array is y and the inner is x ie. state[y][x]
//
// todo some way to compare that vector to other vectors
// [x-1,y-1][x,y-1][x+1,y-1]
// [x-1,y]  [x,y]  [x+1,y]
// [x-1,y+1][x,y+1][x+1,y+1]
//
// todo radios toggle on but not off
//
// todo wire up the next button

function genGrid(x, y) {
  let form = document.createElement('form');
  for (let i = 0; i < y; i++) {
    let div = document.createElement('div');
    for (let i = 0; i < x; i++) {
      let radio = document.createElement('input');
      radio.type = 'radio';
      div.appendChild(radio);
    }
    form.appendChild(div);
  }
  grid.appendChild(form);
}

function readDomState() {
  // return a new state based on the dom's state. use when next is clicked
  let radios = [...grid.firstChild.elements];
  let checked = radios.map(x => x.checked);
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
  // return a new state based on the true or false return value of the supplied function
  let newState = state.map(array => {
    return array.map(i => {
      return conditionFunction(i);
    });
  });

  return newState;
}

function updateGrid(state) {
  // reads the 2d state array and updates the checkBoxes acordingly
  let radios = [...grid.firstChild.elements];
  let count = 0;
  state.forEach(row => {
    row.forEach(x => {
      radios[count].checked = x;
      count++;
    });
  });
}

genGrid(gridSizeX, gridSizeY);
state = readDomState();
state = updateState(x => {
  if (Math.random() > 0.5) return true;
  return false;
});
updateGrid(state);
