let balloon = document.getElementsByTagName('p')[0];
let bEmoji = '🎈';
let eEmoji = '💥';
function inflate(event) {
  //  let size = eval(balloon.style.fontSize.slice(0, 2)); // this causes problems if the number is < 10
  let size = eval(balloon.style.fontSize.replace(/px/, ''));
  if (size > 200) {
    balloon.textContent = eEmoji;
    window.removeEventListener('keyup', inflate);
  }
  if (event.key === 'ArrowUp') balloon.style.fontSize = `${size * 1.1}px`;
  if (event.key === 'ArrowDown') balloon.style.fontSize = `${size * 0.9}px`;
}
window.addEventListener('keyup', inflate);
