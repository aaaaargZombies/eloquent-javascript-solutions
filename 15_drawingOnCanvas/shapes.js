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
startPos[0] += shapeSize;

// A spiral made up of 100 straight line segments -> recursive
// this works but only with 100 lines!?
function spiral(pos, size, lines) {
  cx.translate(pos[0] + size / 2, pos[1] + size / 2);
  let segment = (Math.PI * 2) / lines;
  let angle = segment;
  let x = Math.sin(angle) * (size / 2);
  let y = Math.cos(angle) * (size / 2);
  cx.moveTo(x, y);
  cx.beginPath();
  angle += segment * 3;
  for (let i = 0; i < lines; i++) {
    x = Math.sin(angle) * (size / 2 - i * 0.5);
    y = Math.cos(angle) * (size / 2 - i * 0.5);
    cx.lineTo(x, y);
    angle += segment * 3;
  }
  cx.stroke();
  cx.resetTransform();
}

spiral(startPos, shapeSize, 100);
startPos[0] += shapeSize;

//function spiralRecursive(pos, size, lines) {
//  cx.translate(pos[0], pos[1]);
//  cx.beginPath();
//  cx.moveTo(0, 0);
//
//  let angle = ((Math.PI * 2) / 25) * lines;
//
//  console.log('draw');
//  if (!lines) return;
//
//  let x = Math.cos(angle) * size;
//  let y = Math.sin(angle) * size;
//  console.log({x, y});
//  cx.lineTo(x, y);
//  spiral([x, y], size, lines - 1);
//
//  cx.stroke();
//  cx.resetTransform();
//}

// A yellow star

function yellowStar(pos, size, points) {
  console.log('start yellow star');
  console.log({pos, size, points});
  let radiums = Math.PI * 2;
  let segment = radiums / (points * 2);
  let tips = [];
  let dips = [];

  for (let i = 0; i < points; i++) {
    tips[i] = dips[i - 1] ? dips[i - 1] + segment : segment;
    dips[i] = tips[i] + segment;
  }

  let tipVec = tips.map(t => {
    let x = (Math.sin(t) * size) / 2;
    let y = (Math.cos(t) * size) / 2;
    return {x, y};
  });

  let dipVec = dips.map(d => {
    let x = (Math.sin(d) * size) / 6;
    let y = (Math.cos(d) * size) / 6;
    return {x, y};
  });

  cx.translate(pos[0] + size / 2, pos[1] + size / 2);
  cx.beginPath();
  cx.moveTo(tipVec[0].x, tipVec[0].y);

  for (let i = 1; i < points; i++) {
    // control=(60,10) goal=(90,90)
    //  cx.quadraticCurveTo(60, 10, 90, 90);
    cx.quadraticCurveTo(
      dipVec[i - 1].x,
      dipVec[i - 1].y,
      tipVec[i].x,
      tipVec[i].y,
    );
  }

  cx.quadraticCurveTo(
    dipVec[dipVec.length - 1].x,
    dipVec[dipVec.length - 1].y,
    tipVec[0].x,
    tipVec[0].y,
  );

  cx.fillStyle = 'yellow';
  cx.fill();
  cx.resetTransform();
}

yellowStar(startPos, shapeSize, 8);
// Your code here.
