import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Icon, Label, Menu, Modal } from 'semantic-ui-react';

import { EMPTY_ARRAY, NS_UNITS } from '../../helpers/consts';
import { formatError } from '../../helpers/utils';
import * as shapes from '../shapes';
import FiltersHydrator from '../Filters/FiltersHydrator/FiltersHydrator';
import FilterTags from '../Filters/FilterTags/FilterTags';
import TabsMenu from '../shared/TabsMenu';
import Pagination from '../shared/Pagination';
import ResultsPageHeader from '../shared/ResultsPageHeader';
import ContentUnitList from './List';
import DateRange from './filters/DateRange';
import Others from './filters/Others';

import CreateCCUForm from '../shared/Forms/CreateCCUForm';

const filterTabs = [
  { name: 'Date Range', element: DateRange },
  { name: 'Others', element: Others },
];

class ContentUnitMainPage extends Component {

  static propTypes = {
    pageNo: PropTypes.number,
    total: PropTypes.number,
    items: PropTypes.arrayOf(shapes.ContentUnit),
    wip: PropTypes.bool,
    err: shapes.Error,
    wipOfCreate: PropTypes.bool,
    errOfCreate: shapes.Error,
    onPageChange: PropTypes.func.isRequired,
    onFiltersChange: PropTypes.func.isRequired,
    onFiltersHydrated: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: EMPTY_ARRAY,
    pageNo: 1,
    total: 0,
    wip: false,
    err: null,
    wipOfCreate: false,
    errOfCreate: null,
  };

  state = {
    showFilters: false,
    showNewCCU: true,
  };

  toggleFilters = () => this.setState({ showFilters: !this.state.showFilters });
  toggleNewCCU  = () => this.setState({ showNewCCU: !this.state.showNewCCU });

  render() {
    const { showFilters, showNewCCU } = this.state;

    const { pageNo, total, items, wip, err, onPageChange, onFiltersChange, onFiltersHydrated, wipOfCreate, errOfCreate, create} = this.props;


    return (
      <div>
        <Menu borderless size="large">
          <Menu.Item header>
            <Header content="Content Units" size="medium" color="blue" />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item onClick={this.toggleFilters}>
              <Icon name="filter" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Menu.Item>
            <Menu.Item onClick={this.toggleNewCCU}>
              <Icon name="plus" />
              New Content Unit
            </Menu.Item>
          </Menu.Menu>
        </Menu>

        <FiltersHydrator namespace={NS_UNITS} onHydrated={onFiltersHydrated} />

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
              <FilterTags namespace={NS_UNITS} onClose={onFiltersChange} />
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
              <ContentUnitList items={items} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Modal
          closeIcon
          size="small"
          open={showNewCCU}
          onClose={this.toggleNewCCU}
        >
          <Modal.Header>Create New Content Unit</Modal.Header>
          <Modal.Content>
            <CreateCCUForm wip={wipOfCreate} err={errOfCreate} create={create} />
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default ContentUnitMainPage;
