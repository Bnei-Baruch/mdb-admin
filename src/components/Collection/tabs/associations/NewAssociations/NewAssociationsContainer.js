import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../../../../redux/modules/lists';
import { actions as collectionActions } from '../../../../../redux/modules/collections';
import { selectors as units } from '../../../../../redux/modules/content_units';
import { EMPTY_ARRAY, EMPTY_OBJECT, NS_COLLECTION_UNITS } from '../../../../../helpers/consts';
import NewAssociations from './NewAssociations';

class ContentUnitsContainer extends Component {

  static propTypes = {
    fetchList: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
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

  askForData = (pageNo) => {
    this.props.fetchList(NS_COLLECTION_UNITS, pageNo);
  };

  selectCCU = (data, checked) => {
    const selectedCCU = this.state.selectedCCU;
    const ccu         = data;
    if (checked) {
      selectedCCU.push(ccu);
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
    const { selectedCCU }                    = this.state;
    const { collection, setEditMode, units } = this.props;
    let lastPosition                         = (units[0] ? units[0].position : 0) || 0;
    if (selectedCCU.length === 0) {
      return;
    }
    selectedCCU.forEach((ccu) => {
      lastPosition++;
      this.props.associateUnit(collection.id, { content_unit_id: ccu.id, name: '', position: lastPosition });
    });
    setEditMode(false);
  };

  render() {
    const { selectedCCU } = this.state;
    return (<NewAssociations
      {...this.props}
      selectedCCU={selectedCCU}
      selectCCU={this.selectCCU}
      onPageChange={this.handlePageChange}
      onFiltersChange={() => this.handlePageChange(1)}
      onFiltersHydrated={() => this.handlePageChange(1)}
      associate={this.associate}
    />);
  }
}

const mapState = (state) => {
  const status    = selectors.getNamespaceState(state.lists, NS_COLLECTION_UNITS) || EMPTY_OBJECT;
  const denormIDs = units.denormIDs(state.content_units);
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
