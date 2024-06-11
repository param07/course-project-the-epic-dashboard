import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
//import createLogger from 'redux-logger';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import App from './App';
import movieApp from './reducers';
import './index.css';
import { MovieContainer, MovieDetail, StarDetail,vintageContainer} from './containers';
import { DisplayMsg } from './components';
import { LoginComponent } from './components';

//const loggerMiddleware = createLogger();
const routeMiddleware = routerMiddleware(hashHistory);
let store = createStore(movieApp, composeWithDevTools(
  applyMiddleware(thunkMiddleware, routeMiddleware)));
const history = syncHistoryWithStore(hashHistory,store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} >
    <Route path="/" component={LoginComponent}/>
      <Route path="/home" component={App}>
        <IndexRoute component={MovieContainer} />
        <Route path="/movie/:id" component={MovieDetail} />
        <Route path="/star/:id" component={StarDetail} />
        <Route path="/search/:keyword" component={MovieContainer} />
        <Route path="/vintage" component={vintageContainer} />
        <Route path="/vintage/:id" component={vintageContainer} />
        <Route path="*" component={DisplayMsg} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
