import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CallbackComponent } from 'redux-oidc';
import { push } from 'react-router-redux';

import userManager from '../../helpers/userManager';

class LoginCallback extends PureComponent {
  static propTypes = {
    push: PropTypes.func.isRequired,
  };

  successCallback = (user) => {
    // take location from state (was set where signin flow started)
    let location = '/';
    try {
      const state = JSON.parse(user.state);
      if (state.location) {
        location = state.location;
      }
    } catch (err) {
      console.error('LoginCallback.successCallback: JSON.parse(user.state):', err, user);
    }

    this.props.push(location);
  };

  errorCallback = (err) => {
    console.error('LoginCallback.errorCallback: ', err);
    this.props.push('/');
  };

  render() {
    return (
      <CallbackComponent
        userManager={userManager}
        successCallback={this.successCallback}
        errorCallback={this.errorCallback}
      >
        <div>Redirecting...</div>
      </CallbackComponent>
    );
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators({
    push,
  }, dispatch);
}

export default connect(null, mapDispatch)(LoginCallback);
