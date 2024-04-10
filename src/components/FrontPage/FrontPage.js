import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { selectors } from '../../redux/modules/user';
import { actions as actionsSystem, selectors as selectorsSystem } from '../../redux/modules/system';
import AppLayout from './AppLayout';
import AppRoutes from './AppRoutes';
import ForbiddenPage from './ForbiddenPage';
import LoginPage from './LoginPage';
import { withRouter } from '../../helpers/withRouterPatch';

class FrontPage extends PureComponent {
  static propTypes = {
    user                 : PropTypes.object,
    currentLanguage      : PropTypes.string.isRequired,
    updateCurrentLanguage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    user: null,
  };

  render() {
    const { user, currentLanguage, updateCurrentLanguage } = this.props;

    if (!user) {
      return <LoginPage />;
    }

    if (user.realm_access.roles.every(r => !r.startsWith('archive_'))) {
      return (
        <ForbiddenPage
          user={user}
          currentLanguage={currentLanguage}
          updateCurrentLanguage={updateCurrentLanguage}
        />
      );
    }

    return (
      <AppLayout
        user={user}
        currentLanguage={currentLanguage}
        updateCurrentLanguage={updateCurrentLanguage}
      >
        <AppRoutes />
      </AppLayout>
    );
  }
}

function mapState(state) {
  return {
    user           : selectors.getUser(state.user),
    currentLanguage: selectorsSystem.getCurrentLanguage(state.system),
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({
    updateCurrentLanguage: actionsSystem.updateCurrentLanguage
  }, dispatch);
}

export default withRouter(connect(mapState, mapDispatch)(FrontPage));
