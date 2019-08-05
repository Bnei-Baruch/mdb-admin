import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect, Provider } from 'react-redux';
import { OidcProvider } from 'redux-oidc';
import { ConnectedRouter } from 'react-router-redux';
import 'semantic-ui-css/semantic.min.css';
import { BrowserRouter } from 'react-router-dom';

import userManager from '../../helpers/userManager';
import { selectors as system } from '../../redux/modules/system';
import FrontPage from '../FrontPage/FrontPage';
import '../../stylesheets/Kmedia.css';
import './App.css';

class App extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
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
          <OidcProvider store={store} userManager={userManager}>
            <ConnectedRouter history={history}>
              <BrowserRouter>
                <FrontPage />
              </BrowserRouter>
            </ConnectedRouter>
          </OidcProvider>
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
