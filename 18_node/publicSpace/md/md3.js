function splitEnclosed(regex, string) {
  let match = regex.exec(string);
  if (match === null) return null;
  return [
    string.slice(0, match.index),
    string.slice(match.index, match.index + match[0].length),
    string.slice(match.index + match[0].length, string.length),
  ];
}

function parseCodeblock(string) {
  let regex = /`{3}(.|\n)*?`{3}/;

  let strings = splitEnclosed(regex, string);
  if (strings === null) return string;

  strings[1] = strings[1].replace(/^`{3}/, '').replace(/`{3}$/, '');

  return [
    strings[0],
    {type: 'pre', children: [{type: 'code', children: [strings[1]]}]},
    strings[2],
  ];
}

function skipSpace(string) {
  let first = string.search(/\S/);
  if (first == -1) return '';
  return string.slice(first);
}

function splitBlankLines(string) {
  let regex = /\n{2,}/;
  if (!regex.test(string)) return string;
  return string
    .split(regex)
    .filter(x => x !== '')
    .map(x => skipSpace(x));
}

function lists(regex, element) {
  return string => {
    if (!regex.test(string)) return string;
    return {
      type: element,
      children: string
        .split('\n')
        .map(x => skipSpace(x))
        .map(y => {
          if (!regex.test(y)) console.log(`syntax error: "${y}"`);
          return {type: 'li', children: [y.replace(regex, '')]};
        }),
    };
  };
}

const parseUL = lists(/^[*\-+] /, 'ul');
const parseOL = lists(/^\d\. /, 'ol');

function parseP(string) {
  return {type: 'p', children: [string]};
}

function beginningLineSyntax(regex, element) {
  return string => {
    if (!regex.test(string)) return string;
    return {type: element, children: [string.replace(regex, '')]};
  };
}

const parseBlockquote = beginningLineSyntax(/^> /, 'blockquote');
const parseH1 = beginningLineSyntax(/^#{1}[^#]/, 'h1');
const parseH2 = beginningLineSyntax(/^#{2}[^#]/, 'h2');
const parseH3 = beginningLineSyntax(/^#{3}[^#]/, 'h3');
const parseH4 = beginningLineSyntax(/^#{4}[^#]/, 'h4');
const parseH5 = beginningLineSyntax(/^#{5}[^#]/, 'h5');
const parseH6 = beginningLineSyntax(/^#{6}[^#]/, 'h6');

function parseBoldItalic(string) {
  let regex = /\*{3}(.+?)\*{3}/;

  let strings = splitEnclosed(regex, string);
  if (strings === null) return string;

  strings[1] = strings[1].replace(regex, '$1');

  return [
    strings[0],
    {type: 'em', children: [{type: 'strong', children: [strings[1]]}]},
    strings[2],
  ];
}

function inlineSyntax(regex, element) {
  return string => {
    if (!regex.test(string)) return string;
    let strings = splitEnclosed(regex, string);
    if (strings === null) return string;

    strings[1] = strings[1].replace(regex, '$1');

    return [strings[0], {type: element, children: [strings[1]]}, strings[2]];
  };
}

const parseBold = inlineSyntax(/\*{2}(.+?)\*{2}/, 'strong');
const parseItalic = inlineSyntax(/\*{1}(.+?)\*{1}/, 'em');
const parseCode = inlineSyntax(/\`{1}(.+?)\`{1}/, 'code');

function splitLink(regex, string) {
  let strings = splitEnclosed(regex, string);
  if (strings === null) return null;

  let text = regex.exec(strings[1])[1];
  let link = regex.exec(strings[1])[2];

  return [strings[0], text, link, strings[2]];
}

function parseLink(string) {
  let regex = /[^\!]\[(.+)\]\((.+)\)/;

  let strings = splitLink(regex, string);
  if (strings === null) return string;

  return [
    strings[0],
    {type: 'a', props: {href: strings[2]}, children: [strings[1]]},
    strings[3],
  ];
}

function parseImg(string) {
  let regex = /\!\[(.+)\]\((.+)\)/;

  let strings = splitLink(regex, string);
  if (strings === null) return string;

  return [
    strings[0],
    {type: 'img', props: {alt: strings[1], src: strings[2]}},
    strings[3],
  ];
}

const blockParsers = [
  parseCodeblock,
  splitBlankLines,
  parseUL,
  parseOL,
  parseBlockquote,
  parseH1,
  parseH2,
  parseH3,
  parseH4,
  parseH5,
  parseH6,
  parseP,
];

function parseBlock(string) {
  let newString = string;
  for (let func of blockParsers) {
    if (typeof newString !== 'string') return newString;
    newString = func(newString);
  }
  if (newString.type === 'p') return [newString];

  return newString;
}

function parseBlockElements(string) {
  if (typeof string !== 'string') return string;
  let strings = parseBlock(string);
  while (strings.some(x => typeof x === 'string')) {
    strings = strings.map(x => parseBlock(x)).flat();
  }
  return strings;
}

const inlineParsers = [
  parseBlockquote,
  parseH1,
  parseH2,
  parseH3,
  parseH4,
  parseH5,
  parseH6,
  parseBoldItalic,
  parseBold,
  parseItalic,
  parseCode,
  parseLink,
  parseImg,
];

function parseInline(string) {
  let newString = string;
  for (let func of inlineParsers) {
    if (typeof newString !== 'string') return newString;
    newString = func(newString);
  }

  return newString;
}

function parseInlineElements(array) {
  if (typeof array === 'string') return parseInline(array);
  return array
    .map(x => {
      if (typeof x === 'string') return parseInline(x);
      if (x.type === 'code' || x.type === 'pre' || x.type === 'img') return x;
      if (x.children) {
        return {
          type: x.type,
          children: parseInlineElements(x.children),
          props: x.props,
        };
      }
    })
    .flat();
}

function buildAST(string) {
  let pass1 = parseBlockElements(string);
  let pass2 = parseInlineElements(pass1);
  while (JSON.stringify(pass1) !== JSON.stringify(pass2)) {
    pass1 = pass2;
    pass2 = parseInlineElements(pass1);
  }
  return pass2;
}

function elt(type, props, ...children) {
  let dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  for (let child of children) {
    if (typeof child != 'string') dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
  }
  return dom;
}

function astToHtml(array) {
  return array.map(x => {
    if (typeof x === 'string') return x;
    if (x.children) return elt(x.type, x.props, ...astToHtml(x.children));
    return elt(x.type, x.props);
  });
}

function mdToHtml(string) {
  return astToHtml(buildAST(string));
}

mdToHtml(markdownString).forEach(x => {
  document.body.appendChild(x);
});

mdToHtml('This is a single line string with no syntax!').forEach(x => {
  document.body.appendChild(x);
});
