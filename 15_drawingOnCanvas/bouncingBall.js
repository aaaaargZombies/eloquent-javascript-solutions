let cx = document.querySelector('canvas').getContext('2d');

let lastTime = null;
function frame(time) {
  //  console.log('pong');
  if (lastTime != null) {
    updateAnimation(Math.min(100, time - lastTime) / 1000);
  }
  lastTime = time;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

let x = 200;
let y = 200;
let speedX = 500;
let speedY = 250;
let radius = 10;

function updateAnimation(step) {
  // Your code here.
  cx.clearRect(0, 0, 400, 400);
  cx.fillStyle = 'red';
  cx.lineWidth = 5;
  cx.beginPath();
  cx.strokeRect(0, 0, 400, 400);

  if (x > 400 - radius || x - radius < 0) speedX = -speedX;
  if (y > 400 - radius || y - radius < 0) speedY = -speedY;

  x += step * speedX;
  y += step * speedY;

  cx.arc(x, y, radius, 0, 7);
  cx.fill();
}
