// Fill in the regular expressions


// 1. "car" and "cat"
verify( /ca[rt]/ ,
       ["my car", "bad cats"],
       ["camper", "high art"]);

// 2. "pop" and "prop"
verify(/pop|prop/, // [p|pr]op this works but is the worst possible solution, the current one is as long but more legible.
       ["pop culture", "mad props"],
       ["plop", "prrrop"]);

// 3. "ferret", "ferry" and "ferrari"
verify(/rr[eya]/ ,
       ["ferret", "ferry", "ferrari"],
       ["ferrum", "transfer A"]);

// 4. Any word ending in "ious"
verify( /ious\b/ ,
       ["how delicious", "spacious room"],
       ["ruinous", "consciousness"]);

// 5. A whitespace character followed by a period, comma, colon, or semicolon
verify(/\s[\.,:;]/ ,
       ["bad punctuation ."],
       ["escape the dot"]);

// 6. A word longer than six letters
verify(/\w{7,}/ ,
       ["hottentottententen"],
       ["no", "hotten totten tenten"]);

// 7. A word without the letter "e" (or "E")
verify( /\b[^\We]+\b/i, 
       ["red platypus", "wobbling nest"],
       ["earth bed", "learning ape", "BEET"]);


function verify(regexp, yes, no) {
  // Ignore unfinished exercises
  if (regexp.source == "...") return;
  for (let str of yes) if (!regexp.test(str)) {
    console.log(`Failure to match '${str}'`);
  }
  for (let str of no) if (regexp.test(str)) {
    console.log(`Unexpected match for '${str}'`);
  }
}

// step one: copy the solution over so I don't have to generate my own test.
// step two: use :substitute in vim and the regex below to remove the solutions.
// step three: return tomorow and have a go at producing my own after I've definatly forgotten anything I've seen
//
// :%s/verify(\/.\+/verify( ,/c

