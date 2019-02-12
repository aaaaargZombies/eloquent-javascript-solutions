const person = {
	name: 'dave',
	kg: 99,
	cm: 360,	
};

// this exports the function with an interface object

exports.hi = function() {
	console.log(`hi ${person.name} you weigh ${person.kg}kgs and are ${person.cm}cms tall.\nYou are an unusual shape!`)
}

// this exports the function on its own.

module.exports = function() {
	console.log(`hi ${person.name} you weigh ${person.kg}kgs and are ${person.cm}cms tall.\nYou are an unusual shape!`)
}

// so does this

function hi() {
	console.log(`hi ${person.name} you weigh ${person.kg}kgs and are ${person.cm}cms tall.\nYou are an unusual shape!`)
}

module.exports = hi;
