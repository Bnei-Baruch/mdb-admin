import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Icon, Segment } from 'semantic-ui-react';

import { EMPTY_ARRAY, EMPTY_OBJECT, NS_MERGE_UNITS, CONTENT_UNIT_TYPES } from '../../../../helpers/consts';
import { renderErrWip } from '../../../../helpers/utils';
import * as shapes from '../../../shapes';
import ErrWip from '../../../shared/ErrWip';
import { actions, selectors } from '../../../../redux/modules/lists';
import { selectors as unitsSelectors, actions as unitActions } from '../../../../redux/modules/content_units';
import { selectors as system } from '../../../../redux/modules/system';

import CUList from '../../../BaseClasses/CUList';
import ListWithCheckboxBase from '../../../BaseClasses/ListWithCheckboxBase';

class MergeContentUnitTab extends ListWithCheckboxBase {

  static propTypes = {
    ...ListWithCheckboxBase.propTypes,
    unit: shapes.ContentUnit,
    items: PropTypes.arrayOf(shapes.ContentUnit),
    mergeUnits: PropTypes.func.isRequired,
  };

  usedFiltersNames = ['FreeText', 'DateRange', 'Sources', 'Topics', 'Others'];

  getNamespace = () => NS_MERGE_UNITS;

  getContentType = () => CONTENT_UNIT_TYPES;

  renderList = () => {
    const { items, currentLanguage } = this.props;
    return (<CUList
      {...this.getSelectListProps()}
      items={items}
      currentLanguage={currentLanguage} />);
  };

  mergeCU = () => {
    const { selectedIds } = this.state;
    if (selectedIds.length === 0) {
      return;
    }
    const { unit, mergeUnits } = this.props;
    mergeUnits(unit.id, selectedIds);
    this.setState({ selectedIds: [] });
  };

  render() {
    const { showFilters, selectedIds } = this.state;
    const { wipMerge, errMerge, }      = this.props;

    return (
      <div>
        <Segment clearing secondary size="large">
          Select content units for merge with current
        </Segment>

        <Segment clearing vertical>
          <Button
            onClick={this.toggleFilters}
            color="blue"
            inverted>
            <Icon name="filter" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
          <Button
            onClick={this.mergeCU}
            disabled={selectedIds.length === 0}
            content="Merge"
            color="blue" />
          <ErrWip err={errMerge} wip={wipMerge} />
        </Segment>

        {this.renderFiltersHydrator()}
        {this.renderContent()}
      </div>
    );
  }
}

const mapState = (state) => {
  const status    = selectors.getNamespaceState(state.lists, NS_MERGE_UNITS) || EMPTY_OBJECT;
  const denormIDs = unitsSelectors.denormIDs(state.content_units);
  const wipMerge  = unitsSelectors.getWIP(state.content_units, 'mergeUnits');
  return {
    ...status,
    //todo - check if need filter
    items: Array.isArray(status.items) && status.items.length > 0 ? denormIDs(status.items).filter(u => u) : EMPTY_ARRAY,
    wipMerge,
    errMerge: unitsSelectors.getError(state.content_units, 'mergeUnits'),
    currentLanguage: system.getCurrentLanguage(state.system),
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchList: actions.fetchList,
    setPage: actions.setPage,
    mergeUnits: unitActions.mergeUnits,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(MergeContentUnitTab);