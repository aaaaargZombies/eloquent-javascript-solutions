let cx = document.querySelector('canvas').getContext('2d');
let startPos = [10, 10];
let shapeSize = Math.floor((600 - 20) / 5);
// A trapezoid (a rectangle that is wider on one side)

function trap(pos, size) {
  cx.moveTo(pos[0] + 15, pos[1]);
  cx.lineTo(pos[0], pos[1] + size[1]);
  cx.lineTo(pos[0] + size[0], pos[1] + size[1]);
  cx.lineTo(pos[0] + size[0] - 15, pos[1]);
  cx.lineTo(pos[0] + 15, pos[1]);
  cx.stroke();
}

//trap(startPos, [60, 60]);

function trapTranslate(pos, size, offSet) {
  cx.translate(pos[0], pos[1]);
  cx.moveTo(offSet, 0);
  cx.lineTo(0, size);
  cx.lineTo(size, size);
  cx.lineTo(size - offSet, 0);
  cx.lineTo(offSet, 0);

  cx.stroke();

  cx.resetTransform();
}

trapTranslate(startPos, shapeSize, 15);
startPos[0] += shapeSize;

// A red diamond (a rectangle rotated 45 degrees or ¼π radians)

function rd(pos, size) {
  let edges = 82; // i had to brute force this based on a2 + b2 = c2 because I don't know how to reverse it properly, I won't include the shamefull maths here.
  cx.translate(pos[0] + size / 2, pos[1]);
  cx.rotate(0.25 * Math.PI);
  cx.fillStyle = 'red';
  cx.fillRect(0, 0, edges, edges);
  cx.resetTransform();
}

rd(startPos, shapeSize);
startPos[0] += shapeSize;

// A zigzagging line
function zigZag(pos, size, steps) {
  cx.translate(pos[0], pos[1]);
  cx.beginPath();
  cx.moveTo(0, 0);

  let stepSize = size / steps;
  for (let x = 0; x < steps; x += 2) {
    cx.lineTo(size, stepSize);
    cx.lineTo(0, stepSize * 2);
    cx.translate(0, stepSize * 2);
  }

  cx.stroke();
  cx.resetTransform();
}

zigZag(startPos, shapeSize, 12);

// A spiral made up of 100 straight line segments -> recursive

// A yellow star

// Your code here.
