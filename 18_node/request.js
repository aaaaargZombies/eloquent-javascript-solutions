const {request} = require('http');

request(
  {
    hostname: 'localhost',
    path: '/hello.html',
    port: 8000,
    method: 'POST',
  },
  response => {
    response.on('data', chunk => process.stdout.write(chunk.toString()));
  },
).end('This is just a test');

// Making requests with Node’s raw functionality is rather verbose. There are much more convenient wrapper packages available on NPM. For example, node-fetch provides the promise-based fetch interface that we know from the browser.
