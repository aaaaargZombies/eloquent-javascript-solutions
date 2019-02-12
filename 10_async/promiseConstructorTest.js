let p = new Promise( (yes, no) => {
	setTimeout(() => {yes("doesn't really matter what you call the functions")}, 5000);
});

p.then(x => console.log(x))
	.then(x => x = "arguments a,b  in the Promise constructor are the methods resolve,reject")
	.then(x => console.log(x))



setTimeout(() => console.log(`though its probably really confusing to read if you don't name them as such`), 5500)


console.log(`it looks like`)
