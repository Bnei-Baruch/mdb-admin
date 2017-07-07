import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Icon, Label, Menu } from 'semantic-ui-react';

import { EMPTY_ARRAY, NS_OPERATIONS } from '../../helpers/consts';
import { formatError } from '../../helpers/utils';
import * as shapes from '../shapes';
import FiltersHydrator from '../Filters/FiltersHydrator/FiltersHydrator';
import FilterTags from '../Filters/FilterTags/FilterTags';
import TabsMenu from '../shared/TabsMenu';
import Pagination from '../shared/Pagination';
import ResultsPageHeader from '../shared/ResultsPageHeader';
import OperationsList from './List';
import DateRange from './filters/DateRange';
import Others from './filters/Others';

const filterTabs = [
  { name: 'Date Range', element: DateRange },
  { name: 'Others', element: Others },
];

class FilesMainPage extends Component {

  static propTypes = {
    pageNo: PropTypes.number,
    total: PropTypes.number,
    items: PropTypes.arrayOf(shapes.Operation),
    wip: PropTypes.bool,
    err: shapes.Error,
    onPageChange: PropTypes.func.isRequired,
    onFiltersChange: PropTypes.func.isRequired,
    onFiltersHydrated: PropTypes.func.isRequired,
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
  };

  toggleFilters = () => this.setState({ showFilters: !this.state.showFilters });

  render() {
    const { showFilters } = this.state;

    const { pageNo, total, items, wip, err, onPageChange, onFiltersChange, onFiltersHydrated } = this.props;

    return (
      <div>
        <Menu borderless size="large">
          <Menu.Item header>
            <Header content="Operations" size="medium" color="blue" />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item onClick={this.toggleFilters}>
              <Icon name="filter" />
              {showFilters ? 'Hide' : 'Show' } Filters
            </Menu.Item>
          </Menu.Menu>
        </Menu>

        <FiltersHydrator namespace={NS_OPERATIONS} onHydrated={onFiltersHydrated} />

        <Grid>
          <Grid.Row>
            <Grid.Column>
              {
                showFilters ?
                  <div>
                    <TabsMenu items={filterTabs} onFilterApplication={onFiltersChange} />
                    <br />
                  </div> :
                  null
              }
              <FilterTags namespace={NS_OPERATIONS} onClose={onFiltersChange} />
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
                <Pagination pageNo={pageNo} total={total} onChange={onPageChange} />
              </div>
              <OperationsList items={items} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default FilesMainPage;
