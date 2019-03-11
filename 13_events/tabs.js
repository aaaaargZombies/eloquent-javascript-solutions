function asTabs(node) {
  // Your code here.
  let tabs = Array.from(node.children);
  let header = document.createElement('div');
  // add buttons
  tabs.forEach(tab => {
    let btn = document.createElement('button');
    btn.textContent = tab.getAttribute('data-tabname');
    header.appendChild(btn);
    tab.style = 'display: none;';
  });

  let btns = Array.from(header.children);

  // add tabbing function
  function showTab(event) {
    let btnNum = event.target.textContent;
    tabs.forEach(tab => {
      if (btnNum === tab.getAttribute('data-tabname')) {
        tab.style = 'display: ;';
      } else {
        tab.style = 'display: none;';
      }
    });
  }

  btns.forEach(btn => {
    btn.addEventListener('click', showTab);
  });

  // add button styling
  // turns out styling <button> elements is a nightmare due to the weird relationship with the browsers user agent stylesheet, I'm sure that was intentional.
  function styleBtn(event) {
    btns.forEach(btn => {
      btn.style = '';
    });
    event.target.style = 'color: white;';
  }

  btns.forEach(btn => {
    btn.addEventListener('click', styleBtn);
  });

  tabs[0].style = 'display:;';
  node.insertBefore(header, tabs[0]);
}

asTabs(document.querySelector('tab-panel'));
