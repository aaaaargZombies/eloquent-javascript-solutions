let squareWorker = new Worker('worker.js');
squareWorker.addEventListener('message', event => {
  p = document.createElement('p');
  p.textContent = `The worker responded: ${event.data}`;
  document.body.appendChild(p);
});
squareWorker.postMessage(10);
squareWorker.postMessage(24);
