import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Grid, Header, Icon, Label, Segment } from 'semantic-ui-react';

import { EMPTY_ARRAY, EMPTY_OBJECT, NS_MERGE_UNITS } from '../../../../helpers/consts';
import * as shapes from '../../../shapes';
import { actions, selectors } from '../../../../redux/modules/lists';
import { formatError } from '../../../../helpers/utils';
import FiltersHydrator from '../../../Filters/FiltersHydrator/FiltersHydrator';
import FilterTags from '../../../Filters/FilterTags/FilterTags';
import TabsMenu from '../../../shared/TabsMenu';
import Pagination from '../../../shared/Pagination';
import ResultsPageHeader from '../../../shared/ResultsPageHeader';
import { selectors as unitsSelectors, actions as unitActions } from '../../../../redux/modules/content_units';

import ContentUnitList from './List';
import DateRange from './filters/DateRange';
import Others from './filters/Others';
import FreeText from './filters/FreeText';

const filterTabs = [
  { name: 'Date Range', element: DateRange },
  { name: 'Others', element: Others },
  { name: 'Free Text', element: FreeText },
];

class MergeContentUnitTab extends PureComponent {

  static propTypes = {
    pageNo: PropTypes.number,
    total: PropTypes.number,
    wip: PropTypes.bool,
    err: shapes.Error,
    unit: shapes.ContentUnit,
    units: PropTypes.arrayOf(shapes.ContentUnit),
    fetchList: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
    mergeUnits: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: EMPTY_ARRAY,
    pageNo: 1,
    total: 0,
    wip: false,
    err: null,
  };

  state = {
    showFilters: false,
    selectedCUIds: []
  };

  toggleFilters = () =>
    this.setState({ showFilters: !this.state.showFilters });

  constructor(props) {
    super(props);
    this.selectCU = this.selectCU.bind(this);
  }

  handlePageChange = (pageNo) => {
    const { setPage } = this.props;
    setPage(NS_MERGE_UNITS, pageNo);
    this.askForData(pageNo);
  };

  handleFiltersChange = () => {
    this.handlePageChange(1);
  };

  handleFiltersHydrated = () => {
    this.handlePageChange(1);
  };

  askForData = (pageNo) => {
    this.props.fetchList(NS_MERGE_UNITS, pageNo);
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
      });
    }
    this.setState({ selectedCUIds: [...selectedCUIds] });
  };

  mergeCU = () => {
    const { selectedCUIds } = this.state;
    if (selectedCUIds.length === 0) {
      return;
    }
    const { unit, mergeUnits } = this.props;
    mergeUnits(unit.id, { cuIds: selectedCUIds });
  };

  render() {
    const { showFilters } = this.state;

    const {
            pageNo,
            total,
            wip,
            err
          } = this.props;

    return (
      <div>
        <Segment clearing secondary size="large">
          Select content units for merge with current
        </Segment>

        <Segment clearing vertical>
          <Button
            onClick={this.toggleFilters}
            color="blue"
            floated="right"
            inverted
          >
            <Icon name="filter" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
          <Button
            onClick={this.mergeCU}
            floated="right"
          >
            Merge
          </Button>
        </Segment>

        <FiltersHydrator namespace={NS_MERGE_UNITS} onHydrated={this.handleFiltersHydrated} />

        <Grid>
          <Grid.Row>
            <Grid.Column>
              {
                showFilters ?
                  <div>
                    <TabsMenu items={filterTabs} onFilterApplication={this.handleFiltersChange} />
                    <br />
                  </div> :
                  null
              }
              <FilterTags namespace={NS_MERGE_UNITS} onClose={this.handleFiltersChange} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <div style={{ textAlign: 'right' }}>
                {
                  wip ?
                    <Label color="yellow" icon={{ name: 'spinner', loading: true }} content="Loading" /> :
                    null
                }
                {
                  err ?
                    <Header inverted content={formatError(err)} color="red" icon="warning sign" floated="left" /> :
                    null
                }
                <ResultsPageHeader pageNo={pageNo} total={total} />
                &nbsp;&nbsp;
                <Pagination pageNo={pageNo} total={total} onChange={this.handlePageChange} />
              </div>
              <ContentUnitList
                {...this.props}
                selectedCUIds={this.state.selectedCUIds}
                selectCU={this.selectCU} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

const mapState = (state) => {
  const status    = selectors.getNamespaceState(state.lists, NS_MERGE_UNITS) || EMPTY_OBJECT;
  const denormIDs = unitsSelectors.denormIDs(state.content_units);
  return {
    ...status,
    units: Array.isArray(status.items) && status.items.length > 0 ? denormIDs(status.items) : EMPTY_ARRAY,
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