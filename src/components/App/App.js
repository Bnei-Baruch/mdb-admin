import React from "react";
import {Provider} from "react-redux";
import {ConnectedRouter} from "react-router-redux";
import Layout from "./Layout";
import Routes from "./Routes";

import "semantic-ui-css/semantic.min.css";
import "./App.css";

const App = ({store, history}) => (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Layout>
                <Routes/>
            </Layout>
        </ConnectedRouter>
    </Provider>
);

export default App;
