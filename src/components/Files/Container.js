import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../redux/modules/lists';
import { selectors as files } from '../../redux/modules/files';
import { EMPTY_ARRAY, EMPTY_OBJECT, NS_FILES } from '../../helpers/consts';
import * as shapes from '../shapes';
import MainPage from './MainPage';

class FilesContainer extends Component {

  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    fetchList: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
  };

  getPageNo = (search) => {
    let page = 0;
    if (search) {
      const match = search.match(/page=(\d+)/);
      if (match) {
        page = parseInt(match[1], 10);
      }
    }

    return (isNaN(page) || page <= 0) ? 1 : page;
  };

  handlePageChange = (pageNo) => {
    const { setPage } = this.props;
    setPage(NS_FILES, pageNo);
    this.askForData(pageNo);
  };

  handleFiltersChange = () => this.handlePageChange(1);

  handleFiltersHydrated = () => {
    const { location }       = this.props;
    const pageNoFromLocation = this.getPageNo(location.search);
    this.handlePageChange(pageNoFromLocation);
  };

  askForData = (pageNo) => {
    this.props.fetchList(NS_FILES, pageNo);
  };

  render() {
    const { location, fetchList, setPage, ...rest } = this.props;

    return (
      <MainPage
        {...rest}
        onPageChange={this.handlePageChange}
        onFiltersChange={this.handleFiltersChange}
        onFiltersHydrated={this.handleFiltersHydrated}
      />
    );
  }
}

const mapState = (state) => {
  const status    = selectors.getNamespaceState(state.lists, NS_FILES) || EMPTY_OBJECT;
  const denormIDs = files.denormIDs(state.files);
  return {
    ...status,
    items: Array.isArray(status.items) && status.items.length > 0 ?
      denormIDs(status.items) :
      EMPTY_ARRAY,
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchList: actions.fetchList,
    setPage: actions.setPage,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(FilesContainer);
