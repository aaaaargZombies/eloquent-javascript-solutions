const MOUNTAINS = [
  {name: 'Kilimanjaro', height: 5895, place: 'Tanzania'},
  {name: 'Everest', height: 8848, place: 'Nepal'},
  {name: 'Mount Fuji', height: 3776, place: 'Japan'},
  {name: 'Vaalserberg', height: 323, place: 'Netherlands'},
  {name: 'Denali', height: 6168, place: 'United States'},
  {name: 'Popocatepetl', height: 5465, place: 'Mexico'},
  {name: 'Mont Blanc', height: 4808, place: 'Italy/France'},
];

// I probably made more work for myself by borrowing this function. I had to modify it to except numbers which slowed me down. it also meant I ended up using regex at the end to do the text align after the table was built which didn't make loads of sense.

function elt(type, ...children) {
  let node = document.createElement(type);
  for (let child of children) {
    if (typeof child != 'string' && typeof child != 'number')
      node.appendChild(child);
    else node.appendChild(document.createTextNode(child));
  }
  return node;
}

function buildTable(data) {
  let table = document.createElement('table');
  let head = document.createElement('tr');
  Object.keys(data[0]).forEach(x => {
    head.appendChild(elt('th', x));
  });

  table.appendChild(head);

  data.forEach(x => {
    let row = document.createElement('tr');
    Object.keys(x).forEach(k => {
      row.appendChild(elt('td', x[k]));
    });
    table.appendChild(row);
  });

  return table;
}

document.getElementById('mountains').appendChild(buildTable(MOUNTAINS));

Array.from(document.getElementsByTagName('td')).forEach(x => {
  if (/\d/.test(x.innerText)) x.style.textAlign = 'right';
});
