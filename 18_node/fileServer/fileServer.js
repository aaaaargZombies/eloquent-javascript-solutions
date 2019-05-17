const {createServer} = require('http');
const {parse} = require('url');
const {resolve, sep} = require('path');
const {createReadStream, createWriteStream} = require('fs');
const {rmdir, unlink, stat, readdir, mkdir} = require('fs').promises;
const mime = require('mime');

const methods = Object.create(null);
const baseDirectory = process.cwd();

function urlPath(url) {
  let {pathname} = parse(url);
  let path = resolve(decodeURIComponent(pathname).slice(1));
  if (path != baseDirectory && !path.startsWith(baseDirectory + sep)) {
    // can't seem to provoke this response with /../
    // But I can't escape the base dir so maybe thats fine?
    throw {status: 403, body: 'Forbidden'};
  }
  return path;
}

async function notAllowed(request) {
  return {
    status: 405,
    body: `Method ${request.method} not allowed.`,
  };
}

methods.GET = async function(request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != 'ENOENT') throw error;
    else return {status: 404, body: 'File not found'};
  }
  if (stats.isDirectory()) {
    return {body: (await readdir(path)).join('\n')};
  } else {
    return {body: createReadStream(path), type: mime.getType(path)};
  }
};

methods.DELETE = async function(request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != 'ENOENT') throw error;
    else return {status: 204};
  }
  if (stats.isDirectory()) await rmdir(path);
  else await unlink(path);
  return {status: 204};
};

function pipeStream(from, to) {
  return new Promise((resolve, reject) => {
    from.on('error', reject);
    to.on('error', reject);
    to.on('finish', resolve);
    from.pipe(to);
  });
}

methods.PUT = async function(request) {
  let path = urlPath(request.url);
  await pipeStream(request, createWriteStream(path));
  return {status: 204};
};

methods.MKCOL = async function(request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != 'ENOENT') throw error;
    await mkdir(path);
    return {status: 204};
  }
  if (stats.isDirectory()) return {status: 204};
  return {status: 400, body: 'File already exists!'};
};

createServer((request, response) => {
  let handler = methods[request.method] || notAllowed;
  handler(request)
    .catch(error => {
      if (error.status != null) return error;
      return {body: String(error), status: 500};
    })
    .then(({body, status = 200, type = 'text/plain'}) => {
      response.writeHead(status, {'Content-Type': type});
      if (body && body.pipe) body.pipe(response);
      else response.end(body);
    });
}).listen(8000);
