let code = document.querySelector('#code')
let button = document.querySelector('#button')
let output = document.querySelector('#output')

function run(script){
	let f = new Function(script);
	output.textContent = `${f()}` 
}

button.addEventListener('click', () => {
	run(code.value)
})
