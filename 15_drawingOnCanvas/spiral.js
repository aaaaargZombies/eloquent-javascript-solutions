let cx = document.querySelector('canvas').getContext('2d');
let startPos = [10, 10];
let shapeSize = Math.floor((600 - 20) / 5);

function spiral(pos, size, lines) {
  let segment = (Math.PI * 2) / lines;
  let angle = segment;
  let x = Math.sin(angle) * 50;
  let y = Math.cos(angle) * 50;
  cx.translate(100, 100);
  cx.moveTo(x, y);
  angle += segment * 3;
  for (let i = 0; i < 100; i++) {
    x = Math.sin(angle) * (50 - i * 0.);
    y = Math.cos(angle) * (50 - i * 0.4);
    console.log({x, y});
    cx.lineTo(x, y);
    angle += segment * 3;
    console.log({angle});
  }
  cx.stroke();
}

spiral(startPos, shapeSize, 100);
startPos[0] += shapeSize;
