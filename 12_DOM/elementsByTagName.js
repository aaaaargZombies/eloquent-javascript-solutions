function byTagName(node, tagName) {
  // Your code here.
  tagName = tagName.toUpperCase();
  let elements = [];
  Array.from(node.children).forEach(c => {
    if (c.nodeName == tagName) elements.push(c);
    if (c.children) {
      byTagName(c, tagName).forEach(x => {
        elements.push(x);
      });
    }
  });
  return elements;
}

console.log(byTagName(document.body, 'h1').length);
// → 1
console.log(byTagName(document.body, 'span').length);
// → 3
let para = document.querySelector('p');
console.log(byTagName(para, 'span').length);
// → 2
