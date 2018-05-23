import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { delay, orderBy, uniqBy } from 'lodash';

import { EMPTY_ARRAY, EMPTY_OBJECT, NS_COLLECTION_UNITS } from '../../../../../helpers/consts';
import { actions, selectors } from '../../../../../redux/modules/lists';
import { actions as collectionActions } from '../../../../../redux/modules/collections';
import { selectors as unitsSelectors } from '../../../../../redux/modules/content_units';
import { selectors as system } from '../../../../../redux/modules/system';
import * as shapes from '../../../../shapes';
import NewAssociations from './NewAssociations';

class ContentUnitsContainer extends Component {

  static propTypes = {
    collection: shapes.Collection,
    associatedCUs: PropTypes.arrayOf(shapes.CollectionContentUnit),
    associatedCUIds: PropTypes.object,
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

  selectCCU = (data, checked) => {
    const selectedCCU = this.state.selectedCCU;
    if (checked) {
      selectedCCU.push(data);
    } else {
      selectedCCU.some((ccu, i) => {
        if (ccu.id === data.id) {
          selectedCCU.splice(i, 1);
          return true;
        }
      });
    }
    this.setState({ selectedCCU: [...selectedCCU] });
  };

  selectAllCUs = (checked) => {
    const { items, associatedCUIds } = this.props;
    const { selectedCCU }            = this.state;
    if (checked) {
      this.setState({ selectedCCU: uniqBy([...selectedCCU, ...items.filter(cu => !associatedCUIds.get(cu.id))], 'id') });
    } else {
      this.setState({ selectedCCU: selectedCCU.filter(x => !items.some(y => x.id === y.id)) });
    }
  };

  associate = () => {
    const { selectedCCU }               = this.state;
    const { collection, associatedCUs } = this.props;
    let lastPosition                    = associatedCUs.length > 0 ? associatedCUs[associatedCUs.length - 1].position : 0;
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
        associate={this.associate}
        selectAllCUs={this.selectAllCUs}
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
    currentLanguage: system.getCurrentLanguage(state.system),
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
