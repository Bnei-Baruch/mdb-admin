import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header, Image } from 'semantic-ui-react';

import LoginPage from '../Login/LoginPage';
import logo from './KL_Tree_256.png';

class Welcome extends PureComponent {
  static propTypes = {
    user: PropTypes.object,
  };

  static defaultProps = {
    user: null,
  };

  render() {
    const { user } = this.props;

    if (!user || user.expired) {
      return <LoginPage />;
    }

    console.log('RENDER Welcome', user);

    return (
      <div>
        <br />
        <Image src={logo} centered />
        <br />
        <Header textAlign="center" as="h2" content="Welcome to the BB Archive Admin!" />
      </div>
    );
  }
}

function mapState(state) {
  return {
    user: state.oidc.user
  };
}

export default connect(mapState)(Welcome);
