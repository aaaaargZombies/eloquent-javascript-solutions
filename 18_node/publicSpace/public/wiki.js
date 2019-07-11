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
  }

  process() {
    return htmlToMd(this.dom);
  }

  links() {
    return Array.from(this.dom.querySelectorAll('a')).map(
      x => x.attributes.href.nodeValue,
    );
  }

  imgs() {
    return Array.from(this.dom.querySelectorAll('img'))
      .map(x => x.src)
      .map(x => x.replace(baseUrl, ''));
  }
}

class Write {
  constructor(content) {
    this.dom = elt('textarea', {className: 'write'}, content);
  }

  process() {
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
    addMissingLinks(wiki.view.links());
    addMissingImgs(wiki.view.imgs());
    updateDOM();

    fetch(document.baseURI, {
      method: 'PUT',
      body: document.documentElement.outerHTML,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }
}

async function addMissingLinks(pageLinks) {
  let serverLinks = await fetch(baseUrl + '?dir');
  serverLinks = await serverLinks.text();
  let missingLinks = pageLinks.filter(
    pl =>
      !serverLinks.split('\n').includes(pl) &&
      pl.slice(0, 'http'.length) !== 'http',
  );
  missingLinks.forEach(l => addLink(l));
}

function addLink(link) {
  let body = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>The Public Space Wiki</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div></div>
    <script src="mdToHtml.js"></script>
    <script src="htmlToMd.js"></script>
    <script src="wiki.js"></script>
  </body>
</html>
	`;

  fetch(baseUrl + link, {
    method: 'PUT',
    body: body,
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
async function addMissingImgs(pageImgs) {
  let serverImgs = await fetch(baseUrl + '?dir');
  serverImgs = await serverImgs.text();
  missingImgs = pageImgs.filter(
    i =>
      !serverImgs.split('\n').includes(i) &&
      i.slice(0, 'http'.length) !== 'http',
  );
  missingImgs.forEach(i => {
    addImg(i);
  });
}
// TODO
function addImg(link) {
  debugger;
  let type = link.split('.')[link.split('.').length - 1];
  console.log({type});
  if (!imgTypes.includes(type)) return;
  // this is a new bit for me!
  // file:///home/unicorn/sandbox/JS/eloquent/Eloquent-JavaScript/html/19_paint.html#p_apCzJ1aUDN
  let input = elt('input', {type: 'file', onchange: () => uploadImg(link)});
  // input.files[0] will be useful
  document.querySelector('form').appendChild(input);
  input.click(); // this isn't working??? works when i do it by hand though, 100% works on the paint program from EJS
  // i think its something to do with the need for user interaction, if i make a button that calls the function when clicked will it work?
  input.remove();
}

function uploadImg(link) {
  console.log({link});
}

const container = document.querySelector('div');
const baseUrl = 'http://localhost:8000/';
const imgTypes = ['jpg', 'jpeg', 'gif', 'png', 'apng', 'svg', 'bmp', 'ico'];

function starterHTML() {
  const existingWiki = document.querySelector('.read');
  if (existingWiki) return domChildrenArray(existingWiki);
  const containerChildren = domChildrenArray(container);
  if (containerChildren.length) return containerChildren;
  return [elt('h1', {}, 'WELCOME TO THE MD WIKI')];
}

let wiki = new Wiki(new Read(starterHTML()), new EditBtn());

function updateDOM() {
  if (!container.children.length) {
    container.appendChild(wiki.dom);
    return;
  }
  container.replaceChild(wiki.dom, container.firstChild);
}

updateDOM();
