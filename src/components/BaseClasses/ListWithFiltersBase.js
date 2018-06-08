import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Label, Icon, Menu } from 'semantic-ui-react';

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
allFiltersByName.set('Others', { name: 'Others', element: Others });

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
  };

  state = {
    showFilters: false,
  };

  usedFiltersNames = ['FreeText', 'DateRange', 'Others'];

  setCustomFilter = (key, value) => allFiltersByName.set(key, value);

  getFilterTabs = () => {
    return this.usedFiltersNames.map(n => ({
      ...allFiltersByName.get(n),
      namespace: this.getNamespace(),
      isUpdateQuery: this.getIsUpdateQuery(),
      contentTypes: n === 'Others' ? this.getContentType() : null
    }));
  };

  handlePageChange = (pageNo) => {
    const { setPage, fetchList } = this.props;
    setPage(this.getNamespace(), pageNo, this.getIsUpdateQuery());
    fetchList(this.getNamespace(), pageNo);
  };

  handleFiltersChange = (isToggle = true) => {
    this.handlePageChange(this.getPageNo());
    if (isToggle) {
      this.toggleFilters();
    }
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
    const showFilters = (typeof isShow === 'boolean') ? isShow : !this.state.showFilters;
    this.setState({ showFilters });
  };

  getIsUpdateQuery = () => false;

  getNamespace = () => {
    throw new Error('Not Implemented');
  };

  getContentType        = () => {
    throw new Error('Not Implemented');
  };
  renderHeaderRightSide = () => null;

  renderHeader = (title) => {
    return (
      <Menu borderless size="large">
        <Menu.Item header>
          <Header content={title} size="medium" color="blue" />
        </Menu.Item>
        <Menu.Item onClick={this.toggleFilters}>
          <Icon name="filter" />
          {this.state.showFilters ? 'Hide' : 'Show'} Filters
        </Menu.Item>

        <Menu.Menu position="right">
          {this.renderHeaderRightSide()}
        </Menu.Menu>
      </Menu>
    );
  };

  renderFiltersHydrator = () => {
    return (<FiltersHydrator namespace={this.getNamespace()} onHydrated={this.handleFiltersHydrated} />);
  };

  renderPagination = () => {

    const { pageNo, total, wip, err } = this.props;
    return (<div style={{ textAlign: 'right' }}>
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
    </div>);
  };

  renderContent = (defaultOptions = {}) => {
    const { showFilters }          = this.state;
    const { usePagination = true } = defaultOptions;
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
            {usePagination ? this.renderPagination() : null}
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
