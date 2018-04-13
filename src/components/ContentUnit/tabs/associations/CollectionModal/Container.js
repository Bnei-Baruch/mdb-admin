import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Grid, Header, Icon, Label, Menu } from 'semantic-ui-react';
import uniq from 'lodash/uniq';

import { formatError } from '../../../../../helpers/utils';

import { EMPTY_ARRAY, EMPTY_OBJECT, NS_UNIT_ASSOCIATION_COLLECTION } from '../../../../../helpers/consts';
import { actions, selectors } from '../../../../../redux/modules/lists';
import { actions as collectionActions, selectors as collections } from '../../../../../redux/modules/collections';
import { selectors as tagSelectors } from '../../../../../redux/modules/tags';

import ResultsPageHeader from '../../../../shared/ResultsPageHeader';
import FiltersHydrator from '../../../../Filters/FiltersHydrator/FiltersHydrator';
import FilterTags from '../../../../Filters/FilterTags/FilterTags';
import TabsMenu from '../../../../shared/TabsMenu';
import Pagination from '../../../../shared/Pagination';

import * as shapes from '../../../../shapes';
import CollectionsList from './List';
import DateRange from './filters/DateRange';
import Others from './filters/Others';
import FreeText from './filters/FreeText';

const filterTabs = [
  { name: 'Free Text', element: FreeText },
  { name: 'Date Range', element: DateRange },
  { name: 'Others', element: Others },
];

class NewCollections extends PureComponent {

  static propTypes = {
    items: PropTypes.arrayOf(shapes.Collection),
    getTagByUID: PropTypes.func.isRequired,
    associatedCIds: PropTypes.arrayOf(PropTypes.number),
    pageNo: PropTypes.number,
    total: PropTypes.number,
    wip: PropTypes.bool,
    err: shapes.Error,
  };

  static defaultProps = {
    items: EMPTY_ARRAY,
  };

  state = {
    showFilters: false,
    selectedCIds: []
  };

  componentDidMount() {
    this.askForData(1);
  }

  onPageChange = (pageNo) => {
    const { setPage } = this.props;
    setPage(NS_UNIT_ASSOCIATION_COLLECTION, pageNo);
    this.askForData(pageNo);
  };

  onFiltersChange = () => this.onPageChange(1);

  onFiltersHydrated = () => this.onPageChange(1);

  askForData = (pageNo) => this.props.fetchList(NS_UNIT_ASSOCIATION_COLLECTION, pageNo);

  toggleFilters = () => this.setState({ showFilters: !this.state.showFilters });

  selectCollection = (id, checked) => {
    const selectedCIds = this.state.selectedCIds;
    if (checked) {
      selectedCIds.push(id);
    } else {
      selectedCIds.splice(selectedCIds.findIndex(x => id === x), 1);
    }
    this.setState({ selectedCIds: [...selectedCIds] });
  };

  selectAllCollections = (checked) => {
    const { items, associatedCIds } = this.props;
    const { selectedCIds }          = this.state;
    if (checked) {
      this.setState({ selectedCIds: uniq([...selectedCIds, ...items.filter(c => !associatedCIds.includes(c.id)).map(x => x.id)]) });
    } else {
      this.setState({ selectedCIds: selectedCIds.filter(id => !items.some(y => id === y.id)) });
    }
  };

  render() {

    const { showFilters, selectedCIds } = this.state;
    const {
            pageNo,
            total,
            items,
            wip,
            err,
            getTagByUID,
            associatedCIds
          }                             = this.props;

    return (
      <div>
        <Menu borderless size="large">
          <Menu.Item header>
            <Header content="Collections" size="medium" color="blue" />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item onClick={this.toggleFilters}>
              <Icon name="filter" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Menu.Item>
          </Menu.Menu>
        </Menu>

        <FiltersHydrator namespace={NS_UNIT_ASSOCIATION_COLLECTION} onHydrated={this.onFiltersHydrated} />

        <Grid>
          <Grid.Row>
            <Grid.Column>
              {
                showFilters ?
                  <div>
                    <TabsMenu items={filterTabs} onFilterApplication={this.onFiltersChange} />
                    <br />
                  </div> :
                  null
              }
              <FilterTags namespace={NS_UNIT_ASSOCIATION_COLLECTION} onClose={this.onFiltersChange} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <div style={{ textAlign: 'right' }}>
                {
                  wip ?
                    <Label
                      color="yellow"
                      icon={{ name: 'spinner', loading: true }}
                      content="Loading"
                    /> :
                    null
                }
                {
                  err ?
                    <Header
                      inverted
                      content={formatError(err)}
                      color="red"
                      icon="warning sign"
                      floated="left"
                    /> :
                    null
                }
                <ResultsPageHeader pageNo={pageNo} total={total} />
                &nbsp;&nbsp;
                <Pagination pageNo={pageNo} total={total} onChange={this.onPageChange} />
              </div>
              <CollectionsList
                items={items}
                getTagByUID={getTagByUID}
                selectedCIds={selectedCIds}
                associatedCIds={associatedCIds}
                selectCollection={this.selectCollection}
                selectAllCollections={this.selectAllCollections} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

const mapState = (state) => {
  const status    = selectors.getNamespaceState(state.lists, NS_UNIT_ASSOCIATION_COLLECTION) || EMPTY_OBJECT;
  const denormIDs = collections.denormIDs(state.collections);
  return {
    ...status,
    wip: collections.getWIP(state.collections, 'fetchList'),
    err: collections.getError(state.collections, 'fetchList'),
    items: Array.isArray(status.items) && status.items.length > 0 ?
      denormIDs(status.items) :
      EMPTY_ARRAY,
    getTagByUID: tagSelectors.getTagByUID(state.tags),
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchList: actions.fetchList,
    setPage: actions.setPage,
    create: collectionActions.create,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(NewCollections);
