function domChildrenArray(element) {
  return Array.from(element.childNodes);
}

function parseLists(node) {
  let syntax = node.nodeName === `OL` ? `\n1. ` : `\n* `;
  let md = [];
  md.push(`\n\n`);
  domChildrenArray(node).forEach(n => {
    md.push(syntax, ...parseNode(n));
  });
  return md;
}

function parseNode(node) {
  let md = [];
  if (
    (node.nodeName !== '#text' && syntax[node.nodeName]) ||
    node.nodeName === 'P'
  ) {
    // if (
    //   node.nodeName !== 'EM' ||
    //   node.nodeName !== 'STRONG' ||
    //   node.nodeName !== 'CODE'
    // ) {
    //   md.push(`\n\n`);
    // }
    if (node.nodeName === 'PRE') {
      md.push('\n\n');
    }
    md.push(syntax[node.nodeName]);
  }
  domChildrenArray(node).forEach(n => {
    if (n.nodeName === '#text') {
      md.push(n.textContent);
    } else if (n.nodeName === 'IMG') {
      md.push(` \n\n![${n.alt}](${n.src})`);
    } else if (n.nodeName === 'A') {
      md.push(`[`, ...parseNode(n), `](`, n.attributes.href.nodeValue, `)`);
    } else if (n.nodeName === 'OL') {
      md.push(...parseLists(n));
    } else if (n.nodeName === 'UL') {
      md.push(...parseLists(n));
    } else {
      md.push(...parseNode(n)); // this results in undefined being pushed at the start of a <p>
    }
  });
  if (
    node.nodeName === 'EM' ||
    node.nodeName === 'STRONG' ||
    node.nodeName === 'CODE' ||
    node.nodeName === 'PRE'
  ) {
    md.push(syntax[node.nodeName]);
  }
  return md;
}

function htmlToMd(node) {
  return parseNode(node).join('');
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
  PRE: `\`\``,
};
