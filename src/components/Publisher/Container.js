import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../redux/modules/publishers';
import * as shapes from '../shapes';
import MainPage from './MainPage';

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
  publisher: selectors.getPublisherById(state.publishers, parseInt(props.match.params.id, 10)),
  wip: selectors.getWIP(state.publishers, 'fetchItem'),
  err: selectors.getError(state.publishers, 'fetchItem'),
  wipDetail: selectors.getWIP(state.publishers, 'updateInfo'),
  errDetail: selectors.getError(state.publishers, 'updateInfo'),
});

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchItem: actions.fetchItem,
    updateInfo: actions.updateInfo
  }, dispatch);
}

export default connect(mapState, mapDispatch)(Container);
