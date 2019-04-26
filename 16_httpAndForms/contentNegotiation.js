let url = 'https://eloquentjavascript.net/author';
let mediaTypes = [
  'text/plain',
  'text/html',
  'application/json',
  'application/rainbows+unicorns',
];

for (let type of mediaTypes) {
  // i used 'content-type' in the header but the solution used accept.
  // infact despite all the examples using 'content-type' + MDN the question does specify to use accept
  fetch(url, {headers: {accept: type}}).then(res => {
    console.log(`"${type}" produced a status code: ${res.status}`);
  });
}

// TypeError: NetworkError when attempting to fetch resource.
// for all but 'text/plain' :(
