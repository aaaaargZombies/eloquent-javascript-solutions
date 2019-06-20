// function elt(type, props, ...children) {
//   let dom = document.createElement(type);
//   if (props) Object.assign(dom, props);
//   for (let child of children) {
//     if (typeof child != 'string') dom.appendChild(child);
//     else dom.appendChild(document.createTextNode(child));
//   }
//   return dom;
// }

class Wiki {
  constructor(view, btn) {
    this.view = view;
    this.btn = btn;
    this.dom = elt('form', {}, this.view.dom, this.btn.dom);
  }
}

class Read {
  constructor(content) {
    this.dom = elt('div', {className: 'read'}, ...content);
    // this.dom = elt('div', {className: 'read', innerHTML: content});
  }

  process() {
    // toMarkdown
    // let content = this.dom.innerHTML;
    // return content;
    return htmlToMd(this.dom);
  }
}

class Write {
  constructor(content) {
    this.dom = elt('textarea', {className: 'write'}, content);
  }

  process() {
    // toHTML
    // let content = this.dom.value;
    // console.log(content);
    // return content;

    return mdToHtml(this.dom.value);

    // need to write to server aswell
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
    this.dom = elt('button', {onclick: this.change}, 'SAVE');
  }

  change() {
    wiki = new Wiki(new Read(wiki.view.process()), new EditBtn());
    updateDOM();
  }
}

// TODO need a way to read from existing files for both links and so that changes persist to index.html
const starterHTML = [elt('h1', {}, 'WELCOME TO THE MD WIKI')];

// could wrap this in a function to protect it from global state but doesn't seem like much point given the spec for the exercise.
let wiki = new Wiki(new Read(starterHTML), new EditBtn());
const container = document.querySelector('div');

function updateDOM() {
  container.replaceChild(wiki.dom, container.firstChild);
}

container.appendChild(wiki.dom);
