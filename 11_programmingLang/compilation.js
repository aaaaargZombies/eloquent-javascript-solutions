// Compilation
//
// What we have built is an interpreter. During evaluation, it acts directly on the representation of the program produced by the parser.
//
// Compilation is the process of adding another step between the parsing and the running of a program, which transforms the program into something that can be evaluated more efficiently by doing as much work as possible in advance. For example, in well-designed languages it is obvious, for each use of a binding, which binding is being referred to, without actually running the program. This can be used to avoid looking up the binding by name every time it is accessed, instead directly fetching it from some predetermined memory location.
//
// Traditionally, compilation involves converting the program to machine code, the raw format that a computer’s processor can execute. But any process that converts a program to a different representation can be thought of as compilation.
//
// It would be possible to write an alternative evaluation strategy for Egg, one that first converts the program to a JavaScript program, uses Function to invoke the JavaScript compiler on it, and then runs the result. When done right, this would make Egg run very fast while still being quite simple to implement.
//
// If you are interested in this topic and willing to spend some time on it, I encourage you to try to implement such a compiler as an exercise.

const prog1 = `
do(define(plusOne, fun(a, +(a, 1))),
	print(plusOne(10)))
`;

const prog2 = `
do(define(pow, fun(base, exp,
     if(==(exp, 0),
        1,
        *(base, pow(base, -(exp, 1)))))),
   print(pow(2, 10)))
`;
