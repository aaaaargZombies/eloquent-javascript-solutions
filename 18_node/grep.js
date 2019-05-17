const {stat, readdir, readFile} = require('fs').promises;
const {sep} = require('path');

const regex = new RegExp(process.argv[2]);
const locations = process.argv.slice(3);

console.log(process.cwd());

function testFile(file) {
  readFile(file, 'utf8')
    .then(text => {
      if (regex.test(text)) console.log(file);
    })
    .catch(error => console.log(error));
}

function checkLocations(array, dir) {
  array.forEach(async local => {
    let path = dir + sep + local;
    let stats = await stat(path);
    if (stats.isDirectory()) {
      checkLocations(await readdir(path), path);
      return;
    }
    testFile(path);
  });
}

checkLocations(locations, process.cwd());
