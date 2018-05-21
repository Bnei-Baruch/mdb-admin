import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Label } from 'semantic-ui-react';

import { EMPTY_ARRAY } from '../../helpers/consts';
import { formatError } from '../../helpers/utils';
import * as shapes from '../shapes';
import TabsMenu from '../shared/TabsMenu';
import Pagination from '../shared/Pagination';
import ResultsPageHeader from '../shared/ResultsPageHeader';

import FiltersHydrator from '../Filters/FiltersHydrator/FiltersHydrator';
import FilterTags from '../Filters/FilterTags/FilterTags';
import DateRange from '../Filters/DateRange';
import FreeText from '../Filters/FreeText';
import Sources from '../Filters/Sources';
import Topics from '../Filters/Topics';
import Others from '../Filters/Others';

const allFiltersByName = new Map();
allFiltersByName.set('DateRange', { name: 'Date Range', element: DateRange });
allFiltersByName.set('FreeText', { name: 'Free Text', element: FreeText });
allFiltersByName.set('Sources', { name: 'Sources', element: Sources });
allFiltersByName.set('Topics', { name: 'Topics', element: Topics });

class ListWithFiltersBase extends PureComponent {

  constructor(props) {
    super(props);
    this.props = props;
  }

  static propTypes = {
    total: PropTypes.number,
    pageNo: PropTypes.number,
    wip: PropTypes.bool,
    err: shapes.Error,
    setPage: PropTypes.func.isRequired,
    fetchList: PropTypes.func.isRequired,
  };

  static defaultProps = {
    pageNo: 1,
    total: 0,
    wip: false,
    err: null,
    items: EMPTY_ARRAY,
  };

  state = {
    showFilters: false,
  };

  usedFiltersNames = ['FreeText', 'DateRange'];

  getFilterTabs = () => {
    let filters = this.usedFiltersNames.map(n => ({ ...allFiltersByName.get(n), namespace: this.getNamespace() }));

    filters.push({
      name: 'Others',
      element: Others,
      namespace: this.getNamespace(),
      contentTypes: this.getContentType()
    });
    return filters;
  };

  handlePageChange = (pageNo) => {
    const { setPage, fetchList } = this.props;
    setPage(this.getNamespace(), pageNo);
    fetchList(this.getNamespace(), pageNo);
  };

  handleFiltersChange = () => {
    this.handlePageChange(this.getPageNo());
    this.toggleFilters();
  };

  handleFiltersCancel = () => {
    this.handlePageChange(this.getPageNo());
    this.toggleFilters(false);
  };

  handleChangeFilterFromTag = () => {
    this.handlePageChange(this.getPageNo());
    this.toggleFilters(true);
  };

  handleFiltersHydrated = () => {
    this.handlePageChange(this.getPageNo());
  };

  getPageNo = () => {
    return 1;
  };

  toggleFilters = (isShow) => {
    const showFilters = isShow === undefined ? !this.state.showFilters : isShow;
    this.setState({ showFilters });
  };

  getNamespace = () => {
    throw new Error('Not Implemented');
  };

  getContentType = () => {
    throw new Error('Not Implemented');
  };

  renderFiltersHydrator = () => {
    return (<FiltersHydrator namespace={this.getNamespace()} onHydrated={this.handleFiltersHydrated} />);
  };

  renderContent = () => {
    const { showFilters }             = this.state;
    const { pageNo, total, wip, err } = this.props;
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            {
              showFilters ?
                <div>
                  <TabsMenu items={this.getFilterTabs()} onFilterApplication={this.handleFiltersChange} onFilterCancel={this.handleFiltersCancel} />
                  <br />
                </div> :
                null
            }
            <FilterTags namespace={this.getNamespace()} changeFilterFromTag={this.handleChangeFilterFromTag} />
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
            {this.renderList()}
          </Grid.Column>
        </Grid.Row>
      </Grid>);
  };

  renderList = () => {
    throw new Error('Not Implemented');
  };

  render() {
    throw new Error('Not Implemented');
    // eslint-disable-next-line no-unreachable
    return null;
  }
}

export default ListWithFiltersBase;
