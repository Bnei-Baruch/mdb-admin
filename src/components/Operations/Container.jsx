import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { EMPTY_ARRAY, EMPTY_OBJECT, NS_OPERATIONS } from '../../helpers/consts';
import { actions, selectors } from '../../redux/modules/lists';
import { selectors as operations } from '../../redux/modules/operations';
import * as shapes from '../shapes';
import MainPage from './MainPage';

class OperationsContainer extends Component {
  getPageNo = (search) => {
    let page = 0;
    if (search) {
      const match = search.match(/page=(\d+)/);
      if (match) {
        page = parseInt(match[1], 10);
      }
    }

    return (Number.isNaN(page) || page <= 0) ? 1 : page;
  };

  render() {
    return (<MainPage {...this.props} getPageNo={this.getPageNo} />);
  }
}

const mapState = (state) => {
  const status    = selectors.getNamespaceState(state.lists, NS_OPERATIONS) || EMPTY_OBJECT;
  const denormIDs = operations.denormIDs(state.operations);
  return {
    ...status,
    items: Array.isArray(status.items) && status.items.length > 0
      ? denormIDs(status.items)
      : EMPTY_ARRAY,
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchList: actions.fetchList,
    setPage: actions.setPage,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(OperationsContainer);
