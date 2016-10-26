import React from 'react';
import Relay from 'react-relay';
import ReactDOM from 'react-dom';
import { browserHistory, applyRouterMiddleware, Router } from 'react-router';
import useRelay from 'react-router-relay';
import Route from './routes/Route';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const rootNode = document.getElementById('app');

ReactDOM.render(
  <Router history={browserHistory} routes={Route} render={applyRouterMiddleware(useRelay)} environment={Relay.Store} />,
  rootNode
);
