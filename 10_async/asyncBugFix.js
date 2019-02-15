async function chicks(nest, year) {
  let lines = network(nest).map(async name => {
    return name + ": " +
      await anyStorage(nest, name, `chicks in ${year}`);
  });
  return (await Promise.all(lines)).join("\n");
}

chicks(bigOak, 2017).then(console.log);

// Big Oak: 1
// Cow Pasture: 3
// Butcher Shop: 5
// Woods: 0
// Gilles' Garden: 4
// Fabienne's Garden: 3
// Tall Poplar: 1
// Chateau: 5
// Church Tower: 0
// Jacques' Farm: 1
// Sportsgrounds: 1
// Hawthorn: 5
// Big Maple: 1
// Great Pine: 1
