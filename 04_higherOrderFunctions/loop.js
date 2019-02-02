const loop = (value, testFunk, updateFunk, bodyFunk) => {
	if (!testFunk(value)) {return false;};
	bodyFunk(value);
	loop(updateFunk(value),testFunk, updateFunk, bodyFunk);

};

loop(10, x => x > 0  , x => x = x - 1, console.log);
