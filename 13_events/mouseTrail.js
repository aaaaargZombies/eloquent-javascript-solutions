let scheduled = null;

function trail(event) {
  if (!scheduled) {
    setTimeout(() => {
      if (document.getElementsByClassName('trail').length === 5) {
        document.getElementsByClassName('trail')[0].remove();
      }
      console.log(scheduled.clientX);
      let dot = document.createElement('div');
      dot.className = 'trail';
      dot.style = `top: ${scheduled.clientY}px; left:${scheduled.clientX}px;`;
      document.body.appendChild(dot);

      scheduled = null;
    }, 50);
  }

  scheduled = event;
}

window.addEventListener('mousemove', trail);
