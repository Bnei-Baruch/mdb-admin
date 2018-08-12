import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../redux/modules/collections';
import * as shapes from '../shapes';
import MainPage from './MainPage';

class Container extends Component {
  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    match: shapes.RouterMatch.isRequired,
    fetchItem: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match: { params: { id } } } = this.props;
    this.askForData(id);
  }

  componentWillReceiveProps(nextProps) {
    const { match: { params: { id } } } = this.props;
    const nId                           = nextProps.match.params.id;
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
  collection: selectors.getCollectionById(state.collections, parseInt(props.match.params.id, 10)),
  wip: selectors.getWIP(state.collections, 'fetchItem'),
  err: selectors.getError(state.collections, 'fetchItem'),
});

function mapDispatch(dispatch) {
  return bindActionCreators({ fetchItem: actions.fetchItem }, dispatch);
}

export default connect(mapState, mapDispatch)(Container);
