import React, { PureComponent } from 'react';
import { Button } from 'semantic-ui-react';

import userManager from '../../helpers/userManager';

class LoginPage extends PureComponent {

  handleLogin = (e) => {
    e.preventDefault();
    userManager.signinRedirect();
  };

  render() {
    return (
      <div>
        <h3>Welcome to the redux-oidc sample app!</h3>
        <p>Please log in to continue</p>
        <Button onClick={this.handleLogin}>Login</Button>
      </div>
    );
  }
}

export default LoginPage;
