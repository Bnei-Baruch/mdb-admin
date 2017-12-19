import React, { PureComponent } from 'react';
import { Button } from 'semantic-ui-react';

import * as shapes from '../shapes';
import userManager from '../../helpers/userManager';

class LoginPage extends PureComponent {

  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
  };

  handleLogin = (e) => {
    e.preventDefault();

    // keep current location in state so we'll have it once auth is complete
    // and we're back in the app.
    // We need this to redirect the user to location he wanted in the first place.
    const { location } = this.props;
    userManager.signinRedirect({ state: JSON.stringify({ location }) });
  };

  render() {
    return (
      <div>
        <h3>Welcome to BB Archive admin app!</h3>
        <p>Please log in to continue</p>
        <Button onClick={this.handleLogin}>Login</Button>
      </div>
    );
  }
}

export default LoginPage;
