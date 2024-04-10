import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect, Provider } from 'react-redux';
import { ReduxRouter as ConnectedRouter } from '@lagunovsky/redux-react-router';
import 'semantic-ui-css/semantic.min.css';
import { selectors as system } from '../../redux/modules/system';
import FrontPage from '../FrontPage/FrontPage';
import '../../stylesheets/Kmedia.css';
import './App.css';
import InitKeycloak from '../FrontPage/InitKeycloak';
import InitialFetchAll from '../FrontPage/InitialFetchAll';

class App extends Component {
  static propTypes = {
    store     : PropTypes.object.isRequired,
    history   : PropTypes.object.isRequired,
    isAppReady: PropTypes.bool
  };

  static defaultProps = {
    isAppReady: false
  };

  render() {
    const { isAppReady, store, history } = this.props;
    if (isAppReady) {
      return (
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <InitKeycloak />
            <InitialFetchAll />
            <FrontPage />
          </ConnectedRouter>
        </Provider>
      );
    }

    return (
      <div className="fullscreen-centered">
        <h1>Loading...</h1>
      </div>
    );
  }
}

export default connect(
  state => ({ isAppReady: system.isReady(state.system) })
)(App);
