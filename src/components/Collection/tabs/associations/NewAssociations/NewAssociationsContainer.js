import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import delay from 'lodash/delay';
import orderBy from 'lodash/orderBy';

import { EMPTY_ARRAY, EMPTY_OBJECT, NS_COLLECTION_UNITS } from '../../../../../helpers/consts';
import { actions, selectors } from '../../../../../redux/modules/lists';
import { actions as collectionActions } from '../../../../../redux/modules/collections';
import { selectors as unitsSelectors } from '../../../../../redux/modules/content_units';
import * as shapes from '../../../../shapes';
import NewAssociations from './NewAssociations';

class ContentUnitsContainer extends Component {

  static propTypes = {
    collection: shapes.Collection,
    units: PropTypes.arrayOf(shapes.CollectionContentUnit),
    fetchList: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
    associateUnit: PropTypes.func.isRequired,
    setEditMode: PropTypes.func.isRequired,
  };

  state = {
    pageNo: 1,
    selectedCCU: []
  };

  constructor(props) {
    super(props);
    this.selectCCU = this.selectCCU.bind(this);
  }

  handlePageChange = (pageNo) => {
    const { setPage } = this.props;
    setPage(NS_COLLECTION_UNITS, pageNo);
    this.askForData(pageNo);
  };

  handleFiltersChange = () => {
    this.handlePageChange(1);
  };

  handleFiltersHydrated = () => {
    this.handlePageChange(1);
  };

  askForData = (pageNo) => {
    this.props.fetchList(NS_COLLECTION_UNITS, pageNo);
  };

  selectCCU = (data, checked) => {
    const selectedCCU = this.state.selectedCCU;
    if (checked) {
      selectedCCU.push(data);
    } else {
      selectedCCU.some((ccu, i) => {
        if (ccu.content_unit_id === data.content_unit_id) {
          selectedCCU.splice(i, 1);
          return true;
        }
      });
    }
    this.setState({ selectedCCU });
  };

  associate = () => {
    const { selectedCCU }       = this.state;
    const { collection, units } = this.props;
    let lastPosition            = units.length > 0 ? units[units.length - 1].position : 0;
    if (selectedCCU.length === 0) {
      return;
    }
    const unitsData = orderBy(selectedCCU, 'id').map(u => ({
      content_unit_id: u.id,
      name: '',
      position: ++lastPosition
    }));
    this.props.associateUnit(collection.id, unitsData);

    // we delay here to allow the server to update
    // before we go back to view mode (which will re-fetch associations)
    delay(this.props.setEditMode, Math.min(50 * selectedCCU.length, 500), false);
  };

  render() {
    return (
      <NewAssociations
        {...this.props}
        selectedCCU={this.state.selectedCCU}
        selectCCU={this.selectCCU}
        onPageChange={this.handlePageChange}
        onFiltersChange={this.handleFiltersChange}
        onFiltersHydrated={this.handleFiltersHydrated}
        associate={this.associate}
      />
    );
  }
}

const mapState = (state) => {
  const status    = selectors.getNamespaceState(state.lists, NS_COLLECTION_UNITS) || EMPTY_OBJECT;
  const denormIDs = unitsSelectors.denormIDs(state.content_units);
  return {
    ...status,
    items: Array.isArray(status.items) && status.items.length > 0 ? denormIDs(status.items) : EMPTY_ARRAY,
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchList: actions.fetchList,
    setPage: actions.setPage,
    associateUnit: collectionActions.associateUnit,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(ContentUnitsContainer);
