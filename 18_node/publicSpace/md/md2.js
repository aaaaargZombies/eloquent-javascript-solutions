const markdownString = `A paragraph is a result of a blank line separating a piece of text

like this

aswell as this!

# Welcome

##This is a h2

### This is a h3


This line has *emphasised text* as well as **bold text** and ***both together***!

> this is a blockquote!

In this paragraph I have a [link](/index.html).

In this paragraph I have a \`inline code\`.

* this is
* an unordered list

1. this is
1. an ordered list


![catImage](cat.jpg)

\`\`\`
const cat = "hat"

and then some other stuff

\`\`\`

\`\`\`
let newCodeBlock = "test"

<p>
	A long time a go in a galaxy far far away.
</p>

\`\`\`

`;

// should i try and build a syntax tree then send it through elt()? The string.replace() thing is getting a bit hairy.
//
//
// [
//   'this is a string',
//   {
//     type: 'strong',
//     children: [
//       'just another string'
//       ]
//     },
//    'more string'
//  ]
//
//  if string, then its a string...
//  if object its an dom element with type and children.
//
// ORDER
//
// check for code blocks -> no need to check in children for more stuff
// check for lists -> not sure how to deal with these
// split on \n\n should give all the paragraphs
// check for inline changes.

const syntax = {
  h1: {
    open: '<span># </span><h1>',
    close: '</h1>',
    regex: /#[^#]/,
    syntax: '<span># </span>',
    element: 'h1',
  },

  h2: {
    open: '<span>## </span><h2>',
    close: '</h2>',
    regex: /##[^#]/,
    syntax: '<span> </span>',
    element: 'h2',
  },

  h3: {
    open: '<span>### </span><h3>',
    close: '</h3>',
    regex: /###[^#]/,
    syntax: '<span>### </span>',
    element: 'h3',
  },

  h4: {
    open: '<span>#### </span><h4>',
    close: '</h4>',
    regex: /####[^#]/,
    syntax: '<span>#### </span>',
    element: 'h3',
  },

  h5: {
    open: '<span>##### </span><h5>',
    close: '</h5>',
    regex: /#####[^#]/,
    syntax: '<span>##### </span>',
    element: 'h5',
  },

  h6: {
    open: '<span>###### </span><h6>',
    close: '</h6>',
    regex: /######[^#]/,
    syntax: '<span>###### </span>',
    element: 'h6',
  },

  p: {
    open: '<p>',
    close: '</p>',
    regex: /\n{2,}/,
    element: 'p',
  },

  blockquote: {
    open: '<span>> </span><blockquote>',
    close: '</blockquote>',
    regex: /^> /,
    syntax: '<span>> </span>',
    element: 'blockquote',
  },

  // grabbing groups
  // file:///home/unicorn/sandbox/JS/eloquent/Eloquent-JavaScript/html/09_regexp.html#p_/5YU/Qo2Np

  link: {
    open: '<span>> </span><blockquote>',
    close: '</blockquote>',
    regex: /\[(.+)\]\((.+)\)/,
    syntax: '<span>> </span>',
    element: 'a',
  },

  image: {
    open: '<span>> </span><blockquote>',
    close: '</blockquote>',
    regex: /!\[(.+?)\]\((.+?)\)/,
    syntax: '<span>> </span>',
    element: 'img',
  },

  // TODO i would really like to avoid this extra step because it means creating nested elements in one step which is awkward
  boldItalic: {
    open: '<p><span>``` </span></p><pre><code>',
    close: '</code></pre><p><span>``` </span></p>',
    regex: /\*{3}(.+?)\*{3}/,
    syntax: '<span>*</span>',
    element: ['strong', 'em'],
  },

  bold: {
    open: '<p><span>``` </span></p><pre><code>',
    close: '</code></pre><p><span>``` </span></p>',
    regex: /\*{2}(.+?)\*{2}/,
    syntax: '<span>*</span>',
    element: 'strong',
  },

  italic: {
    open: '<p><span>``` </span></p><pre><code>',
    close: '</code></pre><p><span>``` </span></p>',
    regex: /\*(.+?)\*/,
    syntax: '<span>**</span>',
    element: 'em',
  },

  code: {
    open: '<p><span>``` </span></p><pre><code>',
    close: '</code></pre><p><span>``` </span></p>',
    regex: /`(.+?)`/,
    syntax: '<span>`</span>',
    element: 'code',
  },

  codeblock: {
    open: '<p><span>``` </span></p><pre><code>',
    close: '</code></pre><p><span>``` </span></p>',
    regex: /`{3}(.|\n)*?`{3}/,
    syntax: '<span>```</span>',
  },

  uli: {
    open: '',
    close: '',
    regex: /^[*\-+] /,
    syntax: '<span>* </span>',
    element: 'li',
  },

  oli: {
    open: '<p><span>``` </span></p><pre><code>',
    close: '</code></pre><p><span>``` </span></p>',
    regex: /^\d\. /,
    syntax: '<span>1. </span>',
    element: 'li',
  },
};

function splitMD(el, string) {
  let match = el.regex.exec(string);
  if (match === null) return null;
  return [
    string.slice(0, match.index),
    string.slice(match.index, match.index + match[0].length),
    string.slice(match.index + match[0].length, string.length),
  ];
}

function parseCodeblock(stringArray) {
  let strings = splitMD(syntax.codeblock, stringArray[stringArray.length - 1]);
  if (strings === null) return stringArray;

  let [p1, p2, p3] = strings;

  p2 = p2.replace(/^`{3}/, '');
  p2 = p2.replace(/`{3}$/, '');

  return [
    p1,
    {type: 'pre', children: {type: 'code', children: p2}},
    ...parseCodeblock([p3]),
  ];
}

function parseBlockElements(stringArray) {
  // lists etc should allways end up in the same string because they aren't seperated by a blank space
  let parsed = stringArray
    .map(x => {
      return typeof x === 'string' ? x.split(syntax.p.regex) : x;
    })
    .flat()
    .filter(x => x !== '')
    .map(x => {
      if (typeof x !== 'string') return x;

      if (syntax.blockquote.regex.test(x)) {
        return {
          type: 'blockquote',
          children: x.replace(syntax.blockquote.regex, ''),
        };
      }
      // this is repetative
      if (syntax.uli.regex.test(x)) {
        return {
          type: 'ul',
          children: x.split('\n').map(y => {
            return {type: 'li', children: y.replace(syntax.uli.regex, '')};
          }),
        };
      }
      if (syntax.oli.regex.test(x)) {
        return {
          type: 'ol',
          children: x.split('\n').map(y => {
            return {type: 'li', children: y.replace(syntax.oli.regex, '')};
          }),
        };
      } else {
        return {type: 'p', children: x};
      }
    });

  return parsed;
}

function textStyles(el, string) {
  let strings = splitMD(el, string);
  if (strings === null) return string;
  let [p1, p2, p3] = strings;

  p2 = p2.replace(el.regex, '$1');

  if (typeof el.element !== 'string') {
    p2 = {type: el.element[0], children: {type: el.element[1], children: p2}};
  } else {
    p2 = {type: el.element, children: p2};
  }

  return [p1, p2, p3];
}

function parseH(el, string) {
  if (el.regex.test(string)) {
    return {
      type: el.element,
      children: string.replace(el.regex, ''),
    };
  }
}

function links(el, string) {}

function images(el, string) {}

function parseInlineElements(string) {
  // this is a bit of a bother because i need to call it on the string, then split the string and call all those things again on other parts of the string.
  // maybe each inline element needs its own funtion?
  // -> headers
  // -> code
  // -> boldital
  // -> bold
  // -> ital
}

function parseStringToSudoDOM(string) {}

function parseMDtoHTML(string) {}

// console.log(parseBlockElements(parseCodeblock([markdownString])));

let inlineString = `Amet ***asperiores*** quisquam quis *adipisci* perferendis **saepe** reprehenderit adipisci? Iusto ducimus expedita quam harum neque A blanditiis qui quisquam quos asperiores? Similique?`;
