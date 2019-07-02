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
  let serverLinks = await fetch('http://localhost:8000/?dir');
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

  fetch(`http://localhost:8000/${link}`, {
    method: 'PUT',
    body: body,
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

// TODO need a way to read from existing files for both links and so that changes persist to index.html
// maybe tuple this to doc.quer('div').innerHTML ? [elt(...)] : Array.from(doc.quer('div').childNodes)
// this is the problem of delivering static content then 'rehydrating' to the JS app.
// maybe i want to read from files and update the dom instead of changing out pages????
// how do i update the base URI?
const container = document.querySelector('div');

function starterHTML() {
  // wrap all the logic and spit out something apropriate.
  // debugger;
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
