/*
 *	CURRENTLY SUPPORTED MARKDOWN SYNTAX
 *
 *
 *  INTEND TO SUPPORT
 *
 *  blankline paragraph
 *
 *  # h1
 *  ## h2
 *  ### etc
 *
 *  *  unordered list
 *
 *  1.  ordered list
 *
 *  []() link
 *
 *  ![]() image
 *
 *  > blockQuote
 *
 *  *...* emphasis
 *
 *  **...** bold
 *
 *  `...` inline code
 *
 *  ```
 *  ...  code blocks
 *
 *  ```
 *
 * */

/*  PARSER ORDER OF OPORATIONS
 *
 *  split on /\n\n/
 *  check for code blocks
 *  re-join elemnts between the ``` and make into codeblock
 *
 *  make everything else into paragrpahs
 *
 *  check for other syntax
 *
 *
 * */

const markdownString = `A paragraph is a result of a blank line separating a piece of text

like this

aswell as this!

# Welcome

##This is a h2

### This is a h3


This line has *emphasised text* as well as **bold text** and ***both together***!

> this is a blockquote!

In this paragraph I have a [link](/index.html).

![catImage](cat.jpg)

\`\`\`
const cat = "hat"

and then some other stuff

\`\`\`

`;

const codeBlock = /```/g;

const htmlTags = /([(</)]+[\d\w]+>)/g;

function toMarkdown(string) {
  return string.replace(htmlTags, '');
}

function toHtml(string) {
  // codeBlocks
  let markdown = string.split(/```/);

  if (markdown.length % 2 == 0) {
    console.log('syntax error! ```');
    return;
  }
  if (markdown.length > 1) {
    let tmp = markdown[0];
    for (let x = 1; x < markdown.length; x++) {
      tmp =
        x % 2 != 0
          ? tmp + '<span>```</span><pre><code>' + markdown[x]
          : tmp + '</code></pre><span>```</span>' + markdown[x];
    }
    markdown = tmp;
  }
  console.log(markdown);
}

toHtml(markdownString);
