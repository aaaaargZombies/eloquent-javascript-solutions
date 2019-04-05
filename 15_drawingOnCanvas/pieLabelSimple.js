let cx = document.querySelector('canvas').getContext('2d');

const results = [
  {name: 'Satisfied', count: 1043, color: 'lightblue'},
  {name: 'Neutral', count: 563, color: 'lightgreen'},
  {name: 'Unsatisfied', count: 510, color: 'pink'},
  {name: 'No comment', count: 175, color: 'silver'},
];

let total = results.reduce((sum, {count}) => sum + count, 0);
let currentAngle = -0.5 * Math.PI;
let centerX = 150,
  centerY = 150;

// Add code to draw the slice labels in this loop.
for (let result of results) {
  console.log(result.name);

  let sliceAngle = (result.count / total) * 2 * Math.PI;

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

cx.translate(300, 70);
cx.font = '28px Helvetica';
let textY = 0;

for (let r of results) {
  console.log('oink');
  cx.fillStyle = r.color;
  cx.fillText(r.name, 0, textY);
  textY += 30;
}
