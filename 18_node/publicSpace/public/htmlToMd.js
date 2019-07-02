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
    if (
      node.nodeName !== 'EM' ||
      node.nodeName !== 'STRONG' ||
      node.nodeName !== 'CODE'
    ) {
      md.push(`\n\n`);
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
      md.push(...parseNode(n));
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
  H1: `# `,
  H2: `## `,
  H3: `### `,
  H4: `#### `,
  H5: `##### `,
  H6: `###### `,
  BLOCKQUOTE: `> `,
  EM: `*`,
  STRONG: `**`,
  CODE: `\``,
  PRE: `\`\``,
};
