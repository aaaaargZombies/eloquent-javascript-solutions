let cx = document.querySelector('canvas').getContext('2d');
let startPos = [10, 10];
let shapeSize = Math.floor((600 - 20) / 5);

function yellowStar(pos, size, points) {
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
}

yellowStar(startPos, shapeSize, 8);
