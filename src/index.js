import "core-js/shim";
import "regenerator-runtime/runtime";
import React from "react";
import ReactDOM from "react-dom";
import {applyMiddleware, compose, createStore} from "redux";
import createSagaMiddleware, {delay} from "redux-saga";
import {put} from "redux-saga/effects";
import {routerMiddleware as createRouterMiddleware} from "react-router-redux";
import createHistory from "history/createBrowserHistory";

import reducer from "./redux";
import {actions as system} from "./redux/modules/system";
import allSagas from "./sagas";
import sagaMonitor from "./sagas/sagaMonitor";
import App from "./components/App/App";


//
// Create redux store
//
const isProduction = process.env.NODE_ENV === 'production';
const devToolsArePresent = typeof window === 'object' && typeof window.devToolsExtension !== 'undefined';
const devToolsStoreEnhancer = () => !isProduction && devToolsArePresent ? window.devToolsExtension() : f => f;

const sagaMiddlewareOptions = isProduction ? {} : {sagaMonitor};
const sagaMiddleWare = createSagaMiddleware(sagaMiddlewareOptions);

const history = createHistory({
    basename: isProduction ? '/admin/' : ''
});
const routerMiddleware = createRouterMiddleware(history);

const store = createStore(reducer, {}, compose(
    applyMiddleware(routerMiddleware, sagaMiddleWare),
    devToolsStoreEnhancer()
));


//
// The main application
//
function * application() {
    const appContainer = document.getElementById('root');

    //
    // Show some loading screen until we're good to go
    //
    ReactDOM.render(
        <div style={{
            width: '100vw',
            height: '100vh',
            backgroundColor: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <h1>Loading...</h1>
        </div>,
        appContainer
    );

    //
    // Bootstrap the saga middleware with initial sagas
    //
    allSagas.forEach(saga => sagaMiddleWare.run(saga));

    //
    // Tell everybody, that we're booting now
    //
    store.dispatch(system.boot());

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

    //
    // After everything was initialized correctly, render the application itself.
    //
    ReactDOM.render(<App store={store} history={history}/>, appContainer);
}

sagaMiddleWare.run(application);
