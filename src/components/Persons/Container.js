import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { EMPTY_ARRAY, EMPTY_OBJECT, NS_PERSONS } from '../../helpers/consts';
import { actions, selectors } from '../../redux/modules/lists';
import { actions as personActions, selectors as persons } from '../../redux/modules/persons';
import { selectors as system } from '../../redux/modules/system';
import * as shapes from '../shapes';
import MainPage from './MainPage';

class PersonsContainer extends Component {
  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    wipOfCreate: PropTypes.bool,
    errOfCreate: shapes.Error,
    fetchList: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    wipOfCreate: false,
    errOfCreate: null,
  };

  componentDidMount() {
    this.handlePageChange(1);
  }

  componentDidUpdate(prevProps) {
    const { wipOfCreate } = prevProps;
    const nWip            = this.props.wipOfCreate;
    const nErr            = this.props.errOfCreate;
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

    return (Number.isNaN(page) || page <= 0) ? 1 : page;
  };

  handlePageChange = (pageNo) => {
    const { setPage } = this.props;
    setPage(NS_PERSONS, pageNo);
    this.askForData(pageNo);
  };

  askForData = (pageNo) => {
    this.props.fetchList(NS_PERSONS, pageNo);
  };

  render() {
    const { location, fetchList, setPage, ...rest } = this.props;

    return (
      <MainPage
        {...rest}
        onPageChange={this.handlePageChange}
      />
    );
  }
}

const mapState = (state) => {
  const status    = selectors.getNamespaceState(state.lists, NS_PERSONS) || EMPTY_OBJECT;
  const denormIDs = persons.denormIDs(state.persons);
  return {
    ...status,
    wipOfCreate: persons.getWIP(state.persons, 'create'),
    errOfCreate: persons.getError(state.persons, 'create'),
    items: Array.isArray(status.items) && status.items.length > 0 ? denormIDs(status.items) : EMPTY_ARRAY,
    currentLanguage: system.getCurrentLanguage(state.system),
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchList: actions.fetchList,
    updateInfo: actions.updateInfo,
    setPage: actions.setPage,
    create: personActions.create,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(PersonsContainer);
