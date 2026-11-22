import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as shapes from '../shapes';
import { actions, selectors } from '../../redux/modules/persons';
import MainPage from './MainPage';
import { withRouter } from '../../helpers/withRouterPatch';

class Container extends Component {
  static propTypes = {
    match: shapes.RouterMatch.isRequired,
    fetchItem: PropTypes.func.isRequired,
    updateInfo: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match: { params: { id } } } = this.props;
    this.askForData(id);
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id } } } = prevProps;
    const nId                           = this.props.match.params.id;
    if (id !== nId) {
      this.askForData(nId);
    }
  }

  askForData(id) {
    const x = Number.parseInt(id, 10);
    if (Number.isNaN(x)) {
      return;
    }

    this.props.fetchItem(x);
  }

  render() {
    return <MainPage {...this.props} />;
  }
}

const mapState = (state, props) => ({
  person: selectors.getPersonById(state.persons, parseInt(props.match.params.id, 10)),
  wip: selectors.getWIP(state.persons, 'fetchItem'),
  err: selectors.getError(state.persons, 'fetchItem'),
  wipDetail: selectors.getWIP(state.persons, 'updateInfo'),
  errDetail: selectors.getError(state.persons, 'updateInfo'),
});

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchItem: actions.fetchItem,
    updateInfo: actions.updateInfo
  }, dispatch);
}

export default withRouter(connect(mapState, mapDispatch)(Container));
