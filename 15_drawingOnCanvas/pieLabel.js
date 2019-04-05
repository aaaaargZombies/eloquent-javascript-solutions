let cx = document.querySelector('canvas').getContext('2d');

const results = [
  {name: 'Satisfied', count: 1043, color: 'lightblue'},
  {name: 'Neutral', count: 563, color: 'lightgreen'},
  {name: 'Unsatisfied', count: 510, color: 'pink'},
  {name: 'No comment', count: 175, color: 'silver'},
];

let total = results.reduce((sum, {count}) => sum + count, 0);
let currentAngle = -0.5 * Math.PI;
let centerX = 300,
  centerY = 150;

// Add code to draw the slice labels in this loop.
for (let result of results) {
  console.log(result.name);

  let sliceAngle = (result.count / total) * 2 * Math.PI;
  result.labelAngle = currentAngle + 0.5 * sliceAngle;

  console.log('cw: ', currentAngle);
  console.log('sa: ', sliceAngle);
  console.log('la: ', result.labelAngle);

  cx.beginPath();
  cx.arc(centerX, centerY, 100, currentAngle, currentAngle + sliceAngle);
  cx.fillStyle = result.color;
  cx.lineTo(centerX, centerY);
  cx.fill();

  currentAngle += sliceAngle;
}

cx.translate(centerX, centerY);
cx.font = '28px Helvetica';

// this took ages because I was using Math.sin for the X axis and visa-versa, WHOOOOOPS

for (let r of results) {
  cx.fillStyle = r.color;
  if (Math.cos(r.labelAngle) > 0) {
    cx.textAlign = 'left';
  } else {
    cx.textAlign = 'right';
  }
  cx.fillText(
    r.name,
    Math.cos(r.labelAngle) * 120,
    Math.sin(r.labelAngle) * 120 + 10,
  );
  console.log(r.labelAngle);
}
