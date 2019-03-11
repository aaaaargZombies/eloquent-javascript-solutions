let scheduled = null;

function trail(event) {
  if (!scheduled) {
    setTimeout(() => {
      if (document.getElementsByClassName('trail').length === 5) {
        document.getElementsByClassName('trail')[0].remove();
      }
      let dot = document.createElement('div');
      dot.className = 'trail';
      dot.style = `background: hsla(${Math.random() *
        360},100%,50%,55%); top: ${scheduled.clientY -
        30}px; left:${scheduled.clientX - 30}px;`;
      document.body.appendChild(dot);

      scheduled = null;
    }, 50);
  }

  scheduled = event;
}

window.addEventListener('mousemove', trail);
