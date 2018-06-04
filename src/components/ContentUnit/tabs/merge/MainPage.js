import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import uniq from 'lodash/uniq';
import { Button, Header, Icon, Label, Segment } from 'semantic-ui-react';

import { EMPTY_ARRAY, EMPTY_OBJECT, NS_MERGE_UNITS, CONTENT_UNIT_TYPES } from '../../../../helpers/consts';
import * as shapes from '../../../shapes';
import { actions, selectors } from '../../../../redux/modules/lists';
import { formatError } from '../../../../helpers/utils';
import { selectors as unitsSelectors, actions as unitActions } from '../../../../redux/modules/content_units';
import { selectors as system } from '../../../../redux/modules/system';
import ContentUnitList from './List';

import ListWithFiltersBase from '../../../BaseClasses/ListWithFiltersBase';

class MergeContentUnitTab extends ListWithFiltersBase {

  constructor(props) {
    super(props);
    MergeContentUnitTab.propTypes = {
      ...super.propTypes,
      unit: shapes.ContentUnit,
      units: PropTypes.arrayOf(shapes.ContentUnit),
      mergeUnits: PropTypes.func.isRequired,
    };

    this.state    = {
      ...super.state,
      selectedCUIds: []
    };
    this.selectCU = this.selectCU.bind(this);
  }

  usedFiltersNames = ['FreeText', 'DateRange', 'Sources', 'Topics', 'Others'];

  getNamespace = () => NS_MERGE_UNITS;

  getContentType = () => CONTENT_UNIT_TYPES;

  renderList = () => {
    return (<ContentUnitList
      {...this.props}
      selectedCUIds={this.state.selectedCUIds}
      selectCU={this.selectCU}
      selectAllCUs={this.selectAllCUs} />);
  };

  selectCU = (id, checked) => {
    const selectedCUIds = this.state.selectedCUIds;
    if (checked) {
      selectedCUIds.push(id);
    } else {
      selectedCUIds.some((cuId, i) => {
        if (cuId === id) {
          selectedCUIds.splice(i, 1);
          return true;
        }
        return false;
      });
    }
    this.setState({ selectedCUIds: [...selectedCUIds] });
  };

  selectAllCUs = (checked) => {
    const { units }         = this.props;
    const { selectedCUIds } = this.state;
    if (checked) {
      this.setState({ selectedCUIds: uniq([...selectedCUIds, ...units.map(u => u.id)]) });
    } else {
      this.setState({ selectedCUIds: selectedCUIds.filter(x => !units.some(y => x === y.id)) });
    }
  };

  mergeCU = () => {
    const { selectedCUIds } = this.state;
    if (selectedCUIds.length === 0) {
      return;
    }
    const { unit, mergeUnits } = this.props;
    mergeUnits(unit.id, selectedCUIds);
    this.setState({ selectedCUIds: [] });
  };

  renderIsMergedMessage = (wip, err) => {
    if (err) {
      return <Header inverted content={formatError(err)} color="red" icon="warning sign" floated="left" />;
    }
    return wip ? <Label color="yellow" icon={{ name: 'spinner', loading: true }} content="Loading" /> : null;

  };

  render() {
    const { showFilters }         = this.state;
    const { wipMerge, errMerge, } = this.props;

    return (
      <div>
        <Segment clearing secondary size="large">
          Select content units for merge with current
        </Segment>

        <Segment clearing vertical>
          {this.renderIsMergedMessage(wipMerge, errMerge)}
          <Button
            onClick={this.toggleFilters}
            color="blue"
            inverted
          >
            <Icon name="filter" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
          <Button onClick={this.mergeCU}>
            Merge
          </Button>
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
    units: Array.isArray(status.items) && status.items.length > 0 ? denormIDs(status.items).filter(u => u) : EMPTY_ARRAY,
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