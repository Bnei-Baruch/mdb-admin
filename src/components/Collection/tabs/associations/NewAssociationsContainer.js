import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../../../redux/modules/lists';
import { selectors as units } from '../../../../redux/modules/content_units';
import { EMPTY_ARRAY, EMPTY_OBJECT, NS_COLLECTION_UNITS } from '../../../../helpers/consts';
import * as shapes from '../../../shapes';
import NewAssociations from './NewAssociations';

class ContentUnitsContainer extends Component {

  static propTypes = {
    fetchList: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
  };

  state = {
    pageNo: 1,
    selectedCU: []
  };

  constructor(props) {
    super(props);
    this.selectCU = this.selectCU.bind(this);
  }

  handlePageChange = (pageNo) => {
    const { setPage } = this.props;
    setPage(NS_COLLECTION_UNITS, pageNo);
    this.askForData(pageNo);
  };

  handleFiltersChange = () => this.handlePageChange(1);

  handleFiltersHydrated = () => {
    // const {pageNo} = this.state;
    this.handlePageChange(1);
  };

  askForData = (pageNo) => {
    this.props.fetchList(NS_COLLECTION_UNITS, pageNo);
  };

  selectCU = (data, checked) => {
    let selectedCU = this.state.selectedCU;
    const cu       = data;
    if (checked) {
      selectedCU.push(cu);
    } else {
      selectedCU.some((cu, i) => {
        if (cu.content_unit_id === data.content_unit_id) {
          selectedCU.splice(i, 1);
          return true;
        }
      });
    }
    this.setState({ selectedCU });
  };

  associate = () => {

    const { selectedCU } = this.state;
    const { selectCU } = this.props;
  };

  render() {
    return (<NewAssociations
      {...this.props}
      selectedCU={this.state.selectedCU}
      selectCU={this.selectCU}
      onPageChange={this.handlePageChange}
      onFiltersChange={this.handleFiltersChange}
      onFiltersHydrated={this.handleFiltersHydrated}
      associate={this.associate}
    />);
  }
}

const mapState = (state) => {
  const status    = selectors.getNamespaceState(state.lists, NS_COLLECTION_UNITS) || EMPTY_OBJECT;
  const denormIDs = units.denormIDs(state.content_units);
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

export default connect(mapState, mapDispatch)(ContentUnitsContainer);
