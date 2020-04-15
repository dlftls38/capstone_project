import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Switch } from 'react-router-dom'
import { Login, Register, Home, Dashboard, Domain, ChatbotBuilder,  Memos, Posts, SearchedMemo } from './containers';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';
import history from './history';

import Sorry from './components/chatbot/Sorry';
import Confession from './components/chatbot/Confession';


import './stylesheets/account/Authentication.css';
import './stylesheets/home/Home.css';
import './stylesheets/post/Posts.css'
import './stylesheets/post/post.css';
import './stylesheets/memo/MemoSearch.css'
import './stylesheets/memo/memo.css';
import './stylesheets/chatbot/ChatbotBuilder.css';

import 'bootstrap/dist/css/bootstrap.min.css';

const store = createStore(reducers, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <main>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/signup" component={Register} />
        <Route path="/home" component={Home} />
        <Route exact path="/home/memo" component={Memos} />
        <Route path="/home/memo/:username" component={SearchedMemo}/>
        <Route path="/home/post" component={Posts} />
	  	<Route path="/sorry" component={Sorry} />
		<Route path="/confession" component={Confession} />
      </Switch>
      </main>
    </Router>
    </Provider>,
  document.getElementById('root')
)