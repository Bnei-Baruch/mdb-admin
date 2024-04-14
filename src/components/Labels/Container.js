import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { EMPTY_ARRAY, EMPTY_OBJECT, NS_LABELS } from '../../helpers/consts';
import { actions, selectors } from '../../redux/modules/lists';
import { selectors as labels } from '../../redux/modules/labels';
import { selectors as system } from '../../redux/modules/system';
import MainPage from './MainPage';

class Container extends Component {
  static propTypes = {
    fetchList: PropTypes.func.isRequired,
    setPage  : PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.handlePageChange(1);
  }

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

  handlePageChange = (pageNo) => {
    const { setPage } = this.props;
    setPage(NS_LABELS, pageNo);
    this.askForData(pageNo);
  };

  askForData = (pageNo) => {
    this.props.fetchList(NS_LABELS, pageNo);
  };

  render() {
    const { fetchList, setPage, ...rest } = this.props;

    return (
      <MainPage
        {...rest}
        onPageChange={this.handlePageChange}
      />
    );
  }
}

const mapState = (state) => {
  const status    = selectors.getNamespaceState(state.lists, NS_LABELS) || EMPTY_OBJECT;
  const denormIDs = labels.denormIDs(state.labels);
  const items     = Array.isArray(status.items) && status.items.length > 0 ? denormIDs(status.items) : EMPTY_ARRAY;
  return {
    ...status,
    items,
    currentLanguage: system.getCurrentLanguage(state.system),
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchList: actions.fetchList,
    setPage  : actions.setPage,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(Container);
