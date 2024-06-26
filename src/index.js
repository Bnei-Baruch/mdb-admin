import React from 'react';
import { createRoot } from 'react-dom/client';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware, { delay } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { createRouterMiddleware } from '@lagunovsky/redux-react-router';
import { createBrowserHistory } from 'history';

import * as env from './helpers/env';
import reducer from './redux';
import { actions as system } from './redux/modules/system';
import allSagas from './sagas';
import sagaMonitor from './sagas/helpers/sagaMonitor';
import App from './components/App/App';

const devToolsArePresent    = typeof window === 'object' && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined';
const devToolsStoreEnhancer = () => !env.isProduction && devToolsArePresent ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f;

const sagaMiddlewareOptions = env.isProduction ? {} : { sagaMonitor };
const sagaMiddleWare        = createSagaMiddleware(sagaMiddlewareOptions);

const history          = createBrowserHistory();
const routerMiddleware = createRouterMiddleware(history);

const store = createStore(reducer(history), {}, compose(
  applyMiddleware(routerMiddleware, sagaMiddleWare),
  devToolsStoreEnhancer()
));

// Render regardless of application's state. let App decide what to render.
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App store={store} history={history} />
  </React.StrictMode>
);

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
