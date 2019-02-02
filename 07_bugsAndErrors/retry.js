class PMError extends Error {};

function primitiveMultiply(a,b) {
	let threshold = Math.random();
	if (threshold >= 0.8) {
		return a * b;
	}
	throw new PMError("didnt multiply");
}

function multiTry(a,b) {
	for (;;){
		try {
			return primitiveMultiply(a,b);
		} catch (e) {
			if (e instanceof PMError) {
				console.log(e.message);	
			} else {
				throw e;	
			}
		} 
	}
}

console.log(multiTry(8, 8));
