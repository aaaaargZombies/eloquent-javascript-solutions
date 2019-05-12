const {request, createServer} = require('http');

let requestStream = request(
  {
    hostname: 'localhost',
    path: '/hello.html',
    port: 8000,
    method: 'GET',
    headers: {Accept: 'text/html'},
  },
  response => {
    console.log('Server responded with status code', response.statusCode);
  },
);
requestStream.end();

// Making requests with Node’s raw functionality is rather verbose. There are much more convenient wrapper packages available on NPM. For example, node-fetch provides the promise-based fetch interface that we know from the browser.
