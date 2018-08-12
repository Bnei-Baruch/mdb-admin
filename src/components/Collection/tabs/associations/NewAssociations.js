import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import delay from 'lodash/delay';
import orderBy from 'lodash/orderBy';
import { Icon, Button, Segment } from 'semantic-ui-react';

import {
  EMPTY_ARRAY, EMPTY_OBJECT, NS_COLLECTION_UNITS, CONTENT_UNIT_TYPES
} from '../../../../helpers/consts';
import { actions, selectors } from '../../../../redux/modules/lists';
import { actions as collectionActions } from '../../../../redux/modules/collections';
import { selectors as unitsSelectors } from '../../../../redux/modules/content_units';
import { selectors as system } from '../../../../redux/modules/system';
import * as shapes from '../../../shapes';
import ListWithCheckboxBase from '../../../BaseClasses/ListWithCheckboxBase';
import CUList from '../../../BaseClasses/CUList';

class NewAssociations extends ListWithCheckboxBase {
  static propTypes = {
    ...ListWithCheckboxBase.propTypes,
    collection: shapes.Collection,
    items: PropTypes.arrayOf(shapes.ContentUnit),
    associateUnit: PropTypes.func.isRequired,
    setEditMode: PropTypes.func.isRequired,
  };

  usedFiltersNames = ['FreeText', 'DateRange', 'Sources', 'Topics', 'Others'];

  getNamespace = () => NS_COLLECTION_UNITS;

  getContentType = () => CONTENT_UNIT_TYPES;

  renderList = () => {
    const { items, currentLanguage, associatedIds } = this.props;
    return (
      <CUList
        {...this.getSelectListProps()}
        items={items}
        associatedIds={associatedIds}
        currentLanguage={currentLanguage}
      />
    );
  };

  handleViewMode = () => this.props.setEditMode(false);

  associate = () => {
    const { selectedIds }                            = this.state;
    const { collection, associateUnit, setEditMode } = this.props;

    if (selectedIds.length === 0) {
      return;
    }
    const unitsData = orderBy(selectedIds).map(id => ({
      content_unit_id: id,
      name: '',
      position: this.getNextPosition()
    }));
    associateUnit(collection.id, unitsData);

    // we delay here to allow the server to update
    // before we go back to view mode (which will re-fetch associations)
    delay(setEditMode, Math.min(50 * selectedIds.length, 500), false);
  };

  getNextPosition = () => {
    const { associatedIds, denormIDs } = this.props;

    const lastPosition = associatedIds.length > 0
      ? denormIDs(associatedIds)[associatedIds.length - 1].position
      : 0;

    return lastPosition + 1;
  };

  render() {
    const { showFilters, selectedIds } = this.state;
    return (
      <div>
        <Segment clearing secondary size="large">
          Associate content units to this collection
        </Segment>

        <Segment clearing vertical>
          <Button
            inverted
            color="blue"
            onClick={this.toggleFilters}
          >
            <Icon name="filter" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>

          <Button
            color="blue"
            disabled={selectedIds.length === 0}
            content="Associate content units to this collection"
            onClick={this.associate}
          />
          <Button
            icon="close"
            content="Cancel"
            onClick={this.handleViewMode}
          />
        </Segment>

        {this.renderFiltersHydrator()}
        {this.renderContent()}
      </div>
    );
  }
}

const mapState = (state) => {
  const status    = selectors.getNamespaceState(state.lists, NS_COLLECTION_UNITS) || EMPTY_OBJECT;
  const denormIDs = unitsSelectors.denormIDs(state.content_units);
  return {
    ...status,
    denormIDs: unitsSelectors.denormIDs(state.content_units),
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

export default connect(mapState, mapDispatch)(NewAssociations);
