const {writeFile} = require('fs');
const {readFile} = require('fs').promises;

readFile('file.txt', 'utf8').then(text =>
  console.log('The file contains:', text),
);

// readFile("file.txt", "utf8", (error, text) => {
//   if (error) throw error;
//   console.log("The file contains:", text);
// });

readFile('file.txt').then(buff =>
  console.log(
    'The file contained',
    buff.length,
    'bytes.',
    'The first byte is:',
    buff[0],
  ),
);

writeFile('graffiti.txt', 'Node was here', err => {
  if (err) console.log(`Failed to write file: ${err}`);
  else console.log('File written.');
});
