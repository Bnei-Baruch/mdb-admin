import 'core-js/shim';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware, { delay } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { routerMiddleware as createRouterMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import { loadUser } from 'redux-oidc';

import { isProduction } from './helpers/env';
import userManager from './helpers/userManager';
import reducer from './redux';
import { actions as system } from './redux/modules/system';
import allSagas from './sagas';
import sagaMonitor from './sagas/helpers/sagaMonitor';
import App from './components/App/App';

//
// Create redux store
//

// if (!isProduction) {
//   const { whyDidYouUpdate } = require('why-did-you-update');
//   whyDidYouUpdate(React, { exclude: /Menu*|Dropdown*|List*|Button*|Message*|Link|ReactJWPlayer*/ });
// }

const devToolsArePresent    = typeof window === 'object' && typeof window.devToolsExtension !== 'undefined';
const devToolsStoreEnhancer = () => !isProduction && devToolsArePresent ? window.devToolsExtension() : f => f;

const sagaMiddlewareOptions = isProduction ? {} : { sagaMonitor };
const sagaMiddleWare        = createSagaMiddleware(sagaMiddlewareOptions);

const history          = createHistory({
  basename: isProduction ? '/admin/' : ''
});
const routerMiddleware = createRouterMiddleware(history);

const store = createStore(reducer, {}, compose(
  applyMiddleware(routerMiddleware, sagaMiddleWare),
  devToolsStoreEnhancer()
));

// we have silent_renew configured so we use this instead of the oidc-middleware
loadUser(store, userManager);

// Render regardless of application's state. let App decide what to render.
const appContainer = document.getElementById('root');
ReactDOM.render(<App store={store} history={history} />, appContainer);

//
// The main application
//
function* application() {
  //
  // Bootstrap the saga middleware with initial sagas
  //
  allSagas.forEach(saga => sagaMiddleWare.run(saga));

  //
  // Tell everybody, that we're booting now
  //
  yield put(system.boot());

  // Future: Do Whatever bootstrap logic here
  // Load configuration, load translations, etc...

  // Future: Hydrate server state
  // Deep merges state fetched from server with the state saved in the local storage
  yield put(system.init({}));

  //
  // Just make sure that everybody does their initialization homework
  //
  yield delay(0);

  //
  // Inform everybody, that we're ready now
  //
  yield put(system.ready());
}

sagaMiddleWare.run(application);
