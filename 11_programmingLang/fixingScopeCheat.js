specialForms.set = (args, env) => {
  if (args.length != 2 || args[0].type != 'word') {
    throw new SyntaxError('Bad use of set');
  }
  let varName = args[0].name;
  let value = evaluate(args[1], env);

  // so I cheated and looked but it was really interesting. My failed solution took a similar aproach using the final Object.getPrototypeOf(scope) which results in `null` as the end of a cycle.
  // sadly it suffered some scoping issues itself when called recursively.
  // this use of `for` makes perfect sense now I'm looking at it but I hadn't considered using it in this way.
  // `for` was done with numbers.
  // `if / else` was done with function calls that returned more complicated values.

  for (let scope = env; scope; scope = Object.getPrototypeOf(scope)) {
    if (Object.prototype.hasOwnProperty.call(scope, varName)) {
      scope[varName] = value;
      return value;
    }
  }
  throw new ReferenceError(`Setting undefined variable ${varName}`);
};

run(`
do(define(x, 4),
   define(setx, fun(val, set(x, val))),
   setx(50),
   print(x))
`);
// → 50
run(`set(quux, true)`);
// → Some kind of ReferenceError
