// The way we have defined fun allows functions in Egg to reference the surrounding scope, allowing the function’s body to use local values that were visible at the time the function was defined, just like JavaScript functions do.
//
// 	The following program illustrates this: function f returns a function that adds its argument to f’s argument, meaning that it needs access to the local scope inside f to be able to use binding a.
//

run(`
do(define(f, fun(a, fun(b, +(a, b)))),
   print(f(4)(5)))
`);
// → 9

// Go back to the definition of the fun form and explain which mechanism causes this to work.

specialForms.fun = (args, scope) => {
  // topScope is passed into the function using the scope param.
  if (!args.length) {
    throw new SyntaxError('Functions need a body');
  }
  let body = args[args.length - 1];
  let params = args.slice(0, args.length - 1).map(expr => {
    if (expr.type != 'word') {
      throw new SyntaxError('Parameter names must be words');
    }
    return expr.name;
  });

  return function() {
    if (arguments.length != params.length) {
      throw new TypeError('Wrong number of arguments');
    }
    let localScope = Object.create(scope); // localScope is created using topScope as the prototype, giving it access to existing values but allowing it to create new ones without poluting topScope
    for (let i = 0; i < arguments.length; i++) {
      localScope[params[i]] = arguments[i];
    }
    return evaluate(body, localScope); // when a closure is being  created it repeats the process but this time it its localScope will be a prototype of the localScope we see on above. Giving it access to the values topScope does not have but allowing it to create new values that do not exisit in this scope.
  };
};

// essentially it works like you'd expect in javascript.
