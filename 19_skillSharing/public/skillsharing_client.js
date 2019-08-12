function handleAction(state, action) {
  if (action.type == 'setUser') {
    localStorage.setItem('userName', action.user);
    return Object.assign({}, state, {user: action.user});
  } else if (action.type == 'setTalks') {
    return Object.assign({}, state, {talks: action.talks});
  } else if (action.type == 'newTalk') {
    fetchOK(talkURL(action.title), {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        presenter: state.user,
        summary: action.summary,
      }),
    }).catch(reportError);
  } else if (action.type == 'deleteTalk') {
    fetchOK(talkURL(action.talk), {method: 'DELETE'}).catch(reportError);
  } else if (action.type == 'newComment') {
    fetchOK(talkURL(action.talk) + '/comments', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        author: state.user,
        message: action.message,
      }),
    }).catch(reportError);
  }
  return state;
}

function fetchOK(url, options) {
  return fetch(url, options).then(response => {
    if (response.status < 400) return response;
    else throw new Error(response.statusText);
  });
}

function talkURL(title) {
  return 'talks/' + encodeURIComponent(title);
}

function reportError(error) {
  alert(String(error));
}

function renderUserField(name, dispatch) {
  return elt(
    'label',
    {},
    'Your name: ',
    elt('input', {
      type: 'text',
      value: name,
      onchange(event) {
        dispatch({type: 'setUser', user: event.target.value});
      },
    }),
  );
}

function elt(type, props, ...children) {
  let dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  for (let child of children) {
    if (typeof child != 'string') dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
  }
  return dom;
}

class Talk {
  constructor(talk, dispatch) {
    this.comments = elt('div', {className: 'comments'});
    this.dom = elt(
      'section',
      {className: 'talk'},
      elt(
        'h2',
        null,
        talk.title,
        ' ',
        elt(
          'button',
          {
            type: 'button',
            onclick() {
              dispatch({type: 'deleteTalk', talk: talk.title});
            },
          },
          'Delete',
        ),
      ),
      elt('div', null, 'by ', elt('strong', null, talk.presenter)),
      elt('p', null, talk.summary),
      this.comments,
      elt(
        'form',
        {
          onsubmit(event) {
            event.preventDefault();
            let form = event.target;
            dispatch({
              type: 'newComment',
              talk: talk.title,
              message: form.elements.comment.value,
            });
            form.reset();
          },
        },
        elt('input', {type: 'text', name: 'comment'}),
        ' ',
        elt('button', {type: 'submit'}, 'Add comment'),
      ),
    );
    this.syncState(talk);
  }
  syncState(talk) {
    if (talk != this.talk) {
      this.comments.textContent = '';
      for (let comment of talk.comments) {
        this.comments.appendChild(renderComment(comment));
      }
      this.talk = talk;
    }
  }
}
function renderComment(comment) {
  return elt(
    'p',
    {className: 'comment'},
    elt('strong', null, comment.author),
    ': ',
    comment.message,
  );
}

function renderTalkForm(dispatch) {
  let title = elt('input', {type: 'text'});
  let summary = elt('input', {type: 'text'});
  return elt(
    'form',
    {
      onsubmit(event) {
        event.preventDefault();
        dispatch({type: 'newTalk', title: title.value, summary: summary.value});
        event.target.reset();
      },
    },
    elt('h3', null, 'Submit a Talk'),
    elt('label', null, 'Title: ', title),
    elt('label', null, 'Summary: ', summary),
    elt('button', {type: 'submit'}, 'Submit'),
  );
}

async function pollTalks(update) {
  let tag = undefined;
  for (;;) {
    let response;
    try {
      response = await fetchOK('/talks', {
        headers: tag && {'If-None-Match': tag, Prefer: 'wait=90'},
      });
    } catch (e) {
      console.log('Request failed: ' + e);
      await new Promise(resolve => setTimeout(resolve, 500));
      continue;
    }
    if (response.status == 304) continue;
    tag = response.headers.get('ETag');
    update(await response.json());
  }
}

var SkillShareApp = class SkillShareApp {
  constructor(state, dispatch) {
    this.dispatch = dispatch;
    this.talkDOM = elt('div', {className: 'talks'});
    this.dom = elt(
      'div',
      null,
      renderUserField(state.user, dispatch),
      this.talkDOM,
      renderTalkForm(dispatch),
    );
    this.components = Object.create(null);
    this.syncState(state);
  }

  syncState(state) {
    if (state.talks == this.talks) return;
    this.talks = state.talks;

    // "If the data looks valid, the handler stores an object that represents the new talk in the talks object, possibly overwriting an existing talk with this title, and again calls updated."
    // I was worrying that new talks were overwriting old ones but that seems to be the design so i'll leave it be.

    // only interact via this.components don't read directly from the dom!
    for (let talk of this.talks) {
      let cmp = this.components[talk.title];
      // if the cmp exists in the components and the state then sync it
      if (
        cmp &&
        cmp.talk.author == talk.author &&
        cmp.talk.summary == talk.summary
      ) {
        cmp.syncState(talk);
      } else {
        if (cmp) cmp.dom.remove();
        // if it doesn't exist create it.
        cmp = new Talk(talk, this.dispatch);
        this.components[talk.title] = cmp;
        this.talkDOM.appendChild(cmp.dom);
      }
    }

    for (let title of Object.keys(this.components)) {
      if (!this.talks.map(talk => talk.title).includes(title)) {
        this.components[title].dom.remove();
        delete this.components[title];
      }
    }
  }
};

function runApp() {
  let user = localStorage.getItem('userName') || 'Anon';
  let state, app;
  function dispatch(action) {
    state = handleAction(state, action);
    app.syncState(state);
  }

  pollTalks(talks => {
    if (!app) {
      state = {user, talks};
      app = new SkillShareApp(state, dispatch);
      document.body.appendChild(app.dom);
    } else {
      dispatch({type: 'setTalks', talks});
    }
  }).catch(reportError);
}

runApp();
