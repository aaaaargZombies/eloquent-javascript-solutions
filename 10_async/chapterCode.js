// one thing I've realised looking at this code is that these predefined functions all use callbacks but I can't see how a call back is made.
// what is the equivilent new Promise((res,rej) => {...})
// a callback looks like a function you pass into another function and somewhere in the definition of the exterior function they make it asynchronous.

import {bigOak} from "./crow-tech";
import {defineRequestType} from "./crow-tech";

// readStorage method.
// oporates on the nests storage which is JSON.
// takes:
//		1 the key/name of an array
//		2 a callback function that is called on the array when it returns.
// the function takes the named array as its argument and readStorage returns the result of the function.

bigOak.readStorage("food caches", caches => {
  let firstCache = caches[0];
  bigOak.readStorage(firstCache, info => {
    console.log(info);
  });
});

// send method
// goal: interact with other nests
// takes: 
//		1 the name of a nest which is the destination
//		2 the type of message
//		3 the content of the message
//		4 a callback function to be run once the recieving nest confirms the message has made it.
// returns:
//		1 the result of the callback function

bigOak.send("Cow Pasture", "note", "Let's caw loudly at 7PM",
	() => console.log("Note delivered."));

// Cow Pasture received note: Let's caw loudly at 7PM
// Note delivered.


// defineRequestType function
// goal: to establish how to respond to incomming 'sends' 
// takes:
//		1 the name of the new request
//		2 a function that defines its response once it recieves the request.
// returns:
//		1 the result of thefunction (in this case it prints who send the note and what its contents is)
//		2 runs the done() callback function to inform the other nest its finnished


defineRequestType("note", (nest, content, source, done) => {
  console.log(`${nest.name} received note: ${content}`);
  done();
});


// storage function
// goal: return a promise using the callback interface of the readStorage method
// takes:
//		1 nest object it is calling the readStorage method on
//		2 name of the information it is looking up in storage
// returns
//		1 a promise containing the resulting information

function storage(nest, name) {
  return new Promise(resolve => {
    nest.readStorage(name, result => resolve(result));
  });
}

storage(bigOak, "enemies")
	.then(value => console.log("Got", value));

// Got [
// 0:	"Farmer Jacques' dog"
// 1:	"The butcher"
// 2:	"That one-legged jackdaw"
// 3:	"The boy with the airgun" ]


// name an error
class Timeout extends Error {}


// goal: 
//		1 turn a callback into a promises
//		2 repeat the send method up to 3 times if it does not return within the given timescale
// takes:
//		1 nest object on which to call the send method
//		2 the desination nest to send to
//		3 the type of request to be sent
//		4 the content of the request
// reutns:
//		1 a promise containing the result of the send method or the Timeout error object
function request(nest, target, type, content) {
  return new Promise((resolve, reject) => {
    let done = false;
    function attempt(n) {
      nest.send(target, type, content, (failed, value) => {
        done = true;
        if (failed) reject(failed);
        else resolve(value);
      });
      setTimeout(() => {
        if (done) return;
        else if (n < 3) attempt(n + 1);
        else reject(new Timeout("Timed out"));
      }, 250);
    }
    attempt(1);
  });
}


// goal: wrap defineRequestType with a promise to avoid having to use callbacks
// takes:
//		1 name of the request type
//		2 the function to run when recieving a request of this type
// returns:
//		1 a promise or exception
function requestType(name, handler) {
  defineRequestType(name, (nest, content, source,
                           callback) => {
    try {
      Promise.resolve(handler(nest, content, source))
        .then(response => callback(null, response),
              failure => callback(failure));
    } catch (exception) {
      callback(exception);
    }
  });
}

requestType("ping", () => "pong");

// goal: create an array of nest names that responded to the ping request
// takes:
//		1 a nest object
// returns:
//		1 an array based on nest.neighbors filtered by the succes of their response to ping
function availableNeighbors(nest) {
  let requests = nest.neighbors.map(neighbor => {
    return request(nest, neighbor, "ping")
      .then(() => true, () => false);
  });
  return Promise.all(requests).then(result => {
    return nest.neighbors.filter((_, i) => result[i]);
  });
}

import {everywhere} from "./crow-tech";

everywhere(nest => {
  nest.state.gossip = [];
});

function sendGossip(nest, message, exceptFor = null) {
  nest.state.gossip.push(message);
  for (let neighbor of nest.neighbors) {
    if (neighbor == exceptFor) continue;
    request(nest, neighbor, "gossip", message);
  }
}

requestType("gossip", (nest, message, source) => {
  if (nest.state.gossip.includes(message)) return;
  console.log(`${nest.name} received gossip '${
               message}' from ${source}`);
  sendGossip(nest, message, source);
});

sendGossip(bigOak, "Kids with airgun in the park");
// Cow Pasture received gossip 'Kids with airgun in the park' from Big Oak
// Butcher Shop received gossip 'Kids with airgun in the park' from Big Oak
// Gilles' Garden received gossip 'Kids with airgun in the park' from Big Oak
// Chateau received gossip 'Kids with airgun in the park' from Butcher Shop
// Fabienne's Garden received gossip 'Kids with airgun in the park' from Cow Pasture
// Great Pine received gossip 'Kids with airgun in the park' from Chateau
// Hawthorn received gossip 'Kids with airgun in the park' from Great Pine
// Tall Poplar received gossip 'Kids with airgun in the park' from Chateau
// Jacques' Farm received gossip 'Kids with airgun in the park' from Great Pine
// Big Maple received gossip 'Kids with airgun in the park' from Fabienne's Garden
// Church Tower received gossip 'Kids with airgun in the park' from Big Maple
// Woods received gossip 'Kids with airgun in the park' from Big Maple
// Sportsgrounds received gossip 'Kids with airgun in the park' from Tall Poplar

requestType("connections", (nest, {name, neighbors},
                            source) => {
  let connections = nest.state.connections;
  if (JSON.stringify(connections.get(name)) ==
      JSON.stringify(neighbors)) return;
  connections.set(name, neighbors);
  broadcastConnections(nest, name, source);
});

function broadcastConnections(nest, name, exceptFor = null) {
  for (let neighbor of nest.neighbors) {
    if (neighbor == exceptFor) continue;
    request(nest, neighbor, "connections", {
      name,
      neighbors: nest.state.connections.get(name)
    });
  }
}

everywhere(nest => {
  nest.state.connections = new Map;
  nest.state.connections.set(nest.name, nest.neighbors);
  broadcastConnections(nest, nest.name);
});

function findRoute(from, to, connections) {
  let work = [{at: from, via: null}];
  for (let i = 0; i < work.length; i++) {
    let {at, via} = work[i];
    for (let next of connections.get(at) || []) {
      if (next == to) return via;
      if (!work.some(w => w.at == next)) {
        work.push({at: next, via: via || next});
      }
    }
  }
  return null;
}

function routeRequest(nest, target, type, content) {
  if (nest.neighbors.includes(target)) {
    return request(nest, target, type, content);
  } else {
    let via = findRoute(nest.name, target,
                        nest.state.connections);
    if (!via) throw new Error(`No route to ${target}`);
    return request(nest, via, "route",
                   {target, type, content});
  }
}

requestType("route", (nest, {target, type, content}) => {
  return routeRequest(nest, target, type, content);
});

routeRequest(bigOak, "Church Tower", "note",
	"Incoming jackdaws!");

// Church Tower received note: Incoming jackdaws!

requestType("storage", (nest, name) => storage(nest, name));

// function findInStorage(nest, name) {
//   return storage(nest, name).then(found => {
//     if (found != null) return found;
//     else return findInRemoteStorage(nest, name);
//   });
// }



function network(nest) {
  return Array.from(nest.state.connections.keys());
}

// function findInRemoteStorage(nest, name) {
//   let sources = network(nest).filter(n => n != nest.name);
//   function next() {
//     if (sources.length == 0) {
//       return Promise.reject(new Error("Not found"));
//     } else {
//       let source = sources[Math.floor(Math.random() *
//                                       sources.length)];
//       sources = sources.filter(n => n != source);
//       return routeRequest(nest, source, "storage", name)
//         .then(value => value != null ? value : next(),
//               next);
//     }
//   }
//   return next();
// }

async function findInStorage(nest, name) {
  let local = await storage(nest, name);
  if (local != null) return local;

  let sources = network(nest).filter(n => n != nest.name);
  while (sources.length > 0) {
    let source = sources[Math.floor(Math.random() *
                                    sources.length)];
    sources = sources.filter(n => n != source);
    try {
      let found = await routeRequest(nest, source, "storage",
                                     name);
      if (found != null) return found;
    } catch (_) {}
  }
  throw new Error("Not found");
}


findInStorage(bigOak, "events on 2017-12-21")
	.then(console.log);

// Deep snow. Butcher's garbage can fell over. We chased off the ravens from Saint-Vulbas.

function anyStorage(nest, source, name) {
  if (source == nest.name) return storage(nest, name);
  else return routeRequest(nest, source, "storage", name);
}

async function chicks(nest, year) {
  let lines = network(nest).map(async name => {
    return name + ": " +
      await anyStorage(nest, name, `chicks in ${year}`);
  });
  return (await Promise.all(lines)).join("\n");
}

chicks(bigOak, 2017).then(console.log);

// Big Oak: 1
// Cow Pasture: 3
// Butcher Shop: 5
// Woods: 0
// Gilles' Garden: 4
// Fabienne's Garden: 3
// Tall Poplar: 1
// Chateau: 5
// Church Tower: 0
// Jacques' Farm: 1
// Sportsgrounds: 1
// Hawthorn: 5
// Big Maple: 1
// Great Pine: 1


