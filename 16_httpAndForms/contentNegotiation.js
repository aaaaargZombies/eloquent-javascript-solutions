let url = 'https://eloquentjavascript.net/author';
let mediaTypes = [
  'text/plain',
  'text/html',
  'application/json',
  'application/rainbows+unicorns',
];

for (let type of mediaTypes) {
  fetch(url, {headers: {'content-type': type}}).then(res => {
    console.log(`"${type}" produced a status code: ${res.status}`);
  });
}

// TypeError: NetworkError when attempting to fetch resource.
// for all but 'text/plain' :(
