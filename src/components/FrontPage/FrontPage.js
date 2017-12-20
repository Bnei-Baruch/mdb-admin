import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { selectors } from '../../redux/modules/user';
import AppLayout from './AppLayout';
import AppRoutes from './AppRoutes';
import LoginRoutes from './LoginRoutes';

class MainPage extends PureComponent {

  static propTypes = {
    user: PropTypes.object,
  };

  static defaultProps = {
    user: null,
  };

  render() {
    const { user } = this.props;

    if (!user || user.expired) {
      return <LoginRoutes />;
    }

    return (
      <AppLayout user={user}>
        <AppRoutes />
      </AppLayout>
    );
  }
}

function mapState(state) {
  return {
    user: selectors.getUser(state.user),
  };
}

export default withRouter(connect(mapState)(MainPage));

