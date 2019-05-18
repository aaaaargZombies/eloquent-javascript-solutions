function elt(type, props, ...children) {
  let dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  for (let child of children) {
    if (typeof child != 'string') dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
  }
  return dom;
}

class Wiki {
  constructor(view, btn) {
    this.view = view;
    this.btn = btn;
    this.dom = elt('form', {}, this.view.dom, this.btn.dom);
  }
}

class Read {
  constructor(content) {
    this.dom = elt('div', {class: 'read', innerHTML: content});
  }

  process() {
    // toMarkdown
    let content = this.dom.innerHTML;
    return content;
  }
}

class Write {
  constructor(content) {
    this.dom = elt('textarea', {}, content);
  }

  process() {
    // toHTML
    let content = this.dom.value;
    return content;
  }
}

class EditBtn {
  constructor() {
    this.dom = elt('button', {onclick: this.change}, 'EDIT');
  }

  change() {
    wiki = new Wiki(new Write(wiki.view.process()), new SaveBtn());
    updateDOM();
  }
}

class SaveBtn {
  constructor() {
    this.dom = elt('button', {}, 'SAVE');
  }

  change() {
    wiki = new Wiki(new Edit(wiki.view.process()), new EditBtn());
    updateDOM();
  }
}

const starterHTML = `<h1><span>#</span>Welcome</h1>`;

// let state = new Object(null);
// state.view = new Read(starterHTML);
// state.btn = new EditBtn();
// state.wiki = new Wiki(state.view, state.btn);

// function updateState(state, action) {
//   let newState = Object.assign({}, state, action);
//   newState.wiki = new Wiki(newState.view, newState.btn);
//   return newState;
// }

let wiki = new Wiki(new Read(starterHTML), new EditBtn());
const container = document.querySelector('div');

function updateDOM() {
  container.replaceChild(wiki.dom, container.firstChild);
}

container.appendChild(wiki.dom);
