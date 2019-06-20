function domChildrenArray(element) {
  return Array.from(element.childNodes);
}

function parseLists(node) {
  let syntax = node.nodeName === `OL ` ? `\n1. ` : `\n* `;
  let md = [];
  domChildrenArray(node).forEach(n => {
    md.push(syntax, ...parseNode(n));
  });
  return md;
}

function parseNode(node) {
  // get the node name and grab the syntax
  let md = [];
  let nodeType = node.nodeName;
  if (nodeType !== '#text' && syntax[nodeType]) md.push(syntax[nodeType]);
  // push child nodes to array
  domChildrenArray(node).forEach(n => {
    if (n.nodeName === '#text') {
      md.push(n.textContent);
    }
    if (n.nodeName === 'IMG') {
      md.push(` \n\n![${n.alt}](${n.src})`);
    }
    if (n.nodeName === 'A') {
      md.push(`[`, ...parseNode(n), `](`, n.href, `)`);
    }
    if (n.nodeName === 'OL') {
      md.push(...parseLists(n));
    }
    if (n.nodeName === 'UL') {
      md.push(...parseLists(n));
    } else {
      md.push(...parseNode(n));
    }
  });
  // add enclosing syntax if needed
  if (
    nodeType === 'EM' ||
    nodeType === 'STRONG' ||
    nodeType === 'CODE' ||
    nodeType === 'PRE'
  ) {
    md.push(syntax[nodeType]);
  }
  // return array
  return md;
}

const syntax = {
  P: `\n\n`,
  H1: `\n\n# `,
  H2: `\n\n## `,
  H3: `\n\n### `,
  H4: `\n\n#### `,
  H5: `\n\n##### `,
  H6: `\n\n###### `,
  BLOCKQUOTE: `\n\n> `,
  EM: `*`,
  STRONG: `**`,
  CODE: `\``,
  PRE: `\n\n\`\``,
  // UL: `- `,
  // OL: `1. `,
  // A: `[${text}](${src})`,
  // IMG: `![${text}](${src})`,
};
