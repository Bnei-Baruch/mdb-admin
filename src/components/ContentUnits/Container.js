import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../redux/modules/lists';
import { actions as unitActions, selectors as units } from '../../redux/modules/content_units';
import { EMPTY_ARRAY, EMPTY_OBJECT, NS_UNITS } from '../../helpers/consts';
import * as shapes from '../shapes';
import MainPage from './MainPage';
import { selectors as collections } from '../../redux/modules/collections';

class ContentUnitsContainer extends Component {

  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    wipOfCreate: PropTypes.bool,
    errOfCreate: shapes.Error,
    fetchList: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    wipOfCreate: false,
    errOfCreate: null
  };

  componentWillReceiveProps(nextProps) {
    const { wipOfCreate } = this.props;
    const nWip            = nextProps.wipOfCreate;
    const nErr            = nextProps.errOfCreate;
    if (wipOfCreate && !nWip && !nErr) {
      this.askForData(this.getPageNo());
    }
  }

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
    setPage(NS_UNITS, pageNo);
    this.askForData(pageNo);
  };

  handleFiltersChange = () => this.handlePageChange(1);

  handleFiltersHydrated = () => {
    const { location }       = this.props;
    const pageNoFromLocation = this.getPageNo(location.search);
    this.handlePageChange(pageNoFromLocation);
  };

  askForData = pageNo =>
    this.props.fetchList(NS_UNITS, pageNo);

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
  const status    = selectors.getNamespaceState(state.lists, NS_UNITS) || EMPTY_OBJECT;
  const denormIDs = units.denormIDs(state.content_units);
  return {
    ...status,
    wipOfCreate: units.getWIP(state.content_units, 'create'),
    errOfCreate: units.getError(state.content_units, 'create'),
    items: Array.isArray(status.items) && status.items.length > 0 ?
      denormIDs(status.items) :
      EMPTY_ARRAY,
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchList: actions.fetchList,
    setPage: actions.setPage,
    create: unitActions.create,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(ContentUnitsContainer);
