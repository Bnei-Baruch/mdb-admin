import "core-js/shim";
import "regenerator-runtime/runtime";
import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {applyMiddleware, compose, createStore} from "redux";
import createSagaMiddleware from "redux-saga";
import reducer from "./redux";
import allSagas from "./sagas";
import sagaMonitor from "./sagas/sagaMonitor";
import App from "./components/App/App";
import "./index.css";

const isProduction = process.env.NODE_ENV === "production";


// redux dev tools
const devToolsArePresent = typeof window === "object" && typeof window.devToolsExtension !== "undefined";
const devToolsStoreEnhancer = () => !isProduction && devToolsArePresent ? window.devToolsExtension() : f => f;

// redux-saga middleware
const sagaMiddlewareOptions = isProduction ? {} : {sagaMonitor};
const sagaMiddleWare = createSagaMiddleware(sagaMiddlewareOptions);

// redux store
const store = createStore(reducer, {}, compose(
    applyMiddleware(sagaMiddleWare),
    devToolsStoreEnhancer()
));

// run all sagas
allSagas.forEach(saga => sagaMiddleWare.run(saga));

// render app
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);
