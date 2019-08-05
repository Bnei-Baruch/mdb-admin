import React, { PureComponent } from 'react';
import {
  Button, Grid, Header, Image, Segment
} from 'semantic-ui-react';

import * as shapes from '../shapes';
import userManager from '../../helpers/userManager';
import logo from './KL_Tree_128.png';

class LoginPage extends PureComponent {
  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
  };

  state = {
    signinSilent: true,
  };

  componentDidMount() {
    // keep current location in state so we'll have it once auth is complete
    // and we're back in the app.
    // We need this to redirect the user to location he wanted in the first place.
    const { location } = this.props;
    userManager.signinSilent({ state: JSON.stringify({ location }) })
      .catch(err => this.setState({ signinSilent: false }));
  }

  handleLogin = (e) => {
    e.preventDefault();

    // keep current location in state so we'll have it once auth is complete
    // and we're back in the app.
    // We need this to redirect the user to location he wanted in the first place.
    const { location } = this.props;
    userManager.signinRedirect({ state: JSON.stringify({ location }) });
  };

  renderSilentSigninStatus = () => {
    const { signinSilent } = this.state;
    if (!signinSilent) {
      return null;
    }

    return (
      <Header
        textAlign="center"
        size="tiny"
        content="Checking session status"
        icon={{
          name: 'spinner',
          loading: true
        }}
      />
    );
  };

  render() {
    return (
      <div className="login-form">
        {/*
      Heads up! The styles below are necessary for the correct render of this example.
      You can do same with CSS, the main idea is that all the elements up to the `Grid`
      below must have a height of 100%.
    */}
        <style>{`
      body > div,
      body > div > div,
      body > div > div > div.login-form {
        height: 100%;
      }
    `}
        </style>

        <Grid
          textAlign="center"
          verticalAlign="middle"
          style={{ height: '100%' }}
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Segment raised padded="very" color="blue">
              <Image src={logo} centered />
              <h3>Welcome to BB Archive admin app!</h3>
              <p>Please log in to continue</p>
              <Button primary size="huge" onClick={this.handleLogin}>Login</Button>
              {this.renderSilentSigninStatus()}
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default LoginPage;
