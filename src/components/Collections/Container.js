import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { EMPTY_ARRAY, EMPTY_OBJECT, NS_COLLECTIONS } from '../../helpers/consts';
import { actions, selectors } from '../../redux/modules/lists';
import { actions as collectionActions, selectors as collections } from '../../redux/modules/collections';
import * as shapes from '../shapes';
import MainPage from './MainPage';

class CollectionsContainer extends Component {
  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    wipOfCreate: PropTypes.bool,
    errOfCreate: shapes.Error,
    fetchList: PropTypes.func.isRequired,
  };

  static defaultProps = {
    wipOfCreate: false,
    errOfCreate: null
  };

  componentDidUpdate(prevProps) {
    if (prevProps.wipOfCreate && !this.props.wipOfCreate) {
      this.askForData(1);
    }
  }

  askForData = pageNo => this.props.fetchList(NS_COLLECTIONS, pageNo);

  getPageNo = (notUseLocation) => {
    let page = 0;
    if (!notUseLocation) {
      const match = this.props.location.search.match(/page=(\d+)/);
      if (match) {
        page = parseInt(match[1], 10);
      }
    }

    return (Number.isNaN(page) || page <= 0) ? 1 : page;
  };

  render() {
    const { location, ...rest } = this.props;

    return (
      <MainPage
        {...rest}
        getPageNo={this.getPageNo}
      />
    );
  }
}

const mapState = (state) => {
  const status    = selectors.getNamespaceState(state.lists, NS_COLLECTIONS) || EMPTY_OBJECT;
  const denormIDs = collections.denormIDs(state.collections);
  return {
    ...status,
    wipOfCreate: collections.getWIP(state.collections, 'create'),
    errOfCreate: collections.getError(state.collections, 'create'),
    items: Array.isArray(status.items) && status.items.length > 0 ? denormIDs(status.items) : EMPTY_ARRAY,
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchList: actions.fetchList,
    setPage: actions.setPage,
    create: collectionActions.create,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(CollectionsContainer);
