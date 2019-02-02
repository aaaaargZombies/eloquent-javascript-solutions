const roads = [
  "Alice's House-Bob's House",   "Alice's House-Cabin",
  "Alice's House-Post Office",   "Bob's House-Town Hall",
  "Daria's House-Ernie's House", "Daria's House-Town Hall",
  "Ernie's House-Grete's House", "Grete's House-Farm",
  "Grete's House-Shop",          "Marketplace-Farm",
  "Marketplace-Post Office",     "Marketplace-Shop",
  "Marketplace-Town Hall",       "Shop-Town Hall"
];


function buildGraph(edges) {
  let graph = Object.create(null);
  function addEdge(from, to) {
    if (graph[from] == null) {
      graph[from] = [to];
    } else {
      graph[from].push(to);
    }
  }
  for (let [from, to] of edges.map(r => r.split("-"))) {
    addEdge(from, to);
    addEdge(to, from);
  }
  return graph;
}

const roadGraph = buildGraph(roads);


class VillageState {
  constructor(place, parcels) {
    this.place = place;
    this.parcels = parcels;
  }

  move(destination) {
    if (!roadGraph[this.place].includes(destination)) {
      return this;
    } else {
      let parcels = this.parcels.map(p => {
        if (p.place != this.place) return p;
        return {place: destination, address: p.address};
      }).filter(p => p.place != p.address);
      return new VillageState(destination, parcels);
    }
  }
}


// Alter runRobot to return the number of turns instead of outputting to console.log

function runRobot(state, robot, memory) {
  for (let turn = 0;; turn++) {
		if (state.parcels.length == 0) {
			return turn;
    }
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
  }
}


function randomPick(array) {
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
}



VillageState.random = function(parcelCount = 5) {
  let parcels = [];
  for (let i = 0; i < parcelCount; i++) {
    let address = randomPick(Object.keys(roadGraph));
    let place;
    do {
      place = randomPick(Object.keys(roadGraph));
    } while (place == address);
    parcels.push({place, address});
  }
  return new VillageState("Post Office", parcels);
};


// Eloquent's Robot

function findRoute(graph, from, to) {
  let work = [{at: from, route: []}];
  for (let i = 0; i < work.length; i++) {
    let {at, route} = work[i];
    for (let place of graph[at]) {
      if (place == to) return route.concat(place);
      if (!work.some(w => w.at == place)) {
        work.push({at: place, route: route.concat(place)});
      }
    }
  }
}


function goalOrientedRobot({place, parcels}, route) {
  if (route.length == 0) {
    let parcel = parcels[0];
    if (parcel.place != place) {
      route = findRoute(roadGraph, place, parcel.place);
    } else {
      route = findRoute(roadGraph, place, parcel.address);
    }
	}
  return {direction: route[0], memory: route.slice(1)};
}


// My robot

function closeParcelChecker(place, parcels) {
	let roads = roadGraph[place];
	let closeParcel = "";
	for (let road of roads) {
		for (let parcel of parcels) {
			if (road == parcel.place) {
				closeParcel = parcel;
				return closeParcel
			}
		}
  }
  return false;
}

function speedyBot({place,parcels},route) {
	if (route.length == 0) {
		let closeParcel= closeParcelChecker(place,parcels);
		let parcel = closeParcel != false ? closeParcel : parcels[0];
    if (parcel.place != place) {
      route = findRoute(roadGraph, place, parcel.place);
    } else {
      route = findRoute(roadGraph, place, parcel.address);
    }
	}
  return {direction: route[0], memory: route.slice(1)};

}

// from the books answer 

 function lazyRobot({place, parcels}, route) {
   if (route.length == 0) {
     // Describe a route for every parcel
     let routes = parcels.map(parcel => {
       if (parcel.place != place) {
         return {route: findRoute(roadGraph, place, parcel.place),
                 pickUp: true};
       } else {
         return {route: findRoute(roadGraph, place, parcel.address),
                 pickUp: false};
       }
     });
 
     // This determines the precedence a route gets when choosing.
     // Route length counts negatively, routes that pick up a package
     // get a small bonus.
     function score({route, pickUp}) {
       return (pickUp ? 0.5 : 0) - route.length;
     }
     route = routes.reduce((a, b) => score(a) > score(b) ? a : b).route;
   }
 
   return {direction: route[0], memory: route.slice(1)};
 }


// My test

function average(array) {
	return array.reduce((a, b) => a + b) / array.length;
}

function compareRobots(robotA,robotB,startMem) {
	let speedA = [],
			speedB = [];

	for (let i = 0; i <= 100; i++ ) {
		let task = VillageState.random();
		speedA.push(runRobot(task,robotA,startMem));
		speedB.push(runRobot(task,robotB,startMem));
	}

	console.log(`${robotA.name} took on average ${average(speedA)} turns.`);
	console.log(`${robotB.name} took on average ${average(speedB)} turns.`);

}

compareRobots(speedyBot,goalOrientedRobot,[]);
compareRobots(speedyBot,lazyRobot,[]);
