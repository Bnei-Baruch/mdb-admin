import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Icon, Label, Menu, Modal } from 'semantic-ui-react';

import { EMPTY_ARRAY, NS_PERSONS } from '../../helpers/consts';
import { formatError } from '../../helpers/utils';
import * as shapes from '../shapes';
import FiltersHydrator from '../Filters/FiltersHydrator/FiltersHydrator';
import FilterTags from '../Filters/FilterTags/FilterTags';
import TabsMenu from '../shared/TabsMenu';
import Pagination from '../shared/Pagination';
import ResultsPageHeader from '../shared/ResultsPageHeader';
import CreateCollectionForm from '../shared/Forms/Collection/CreateCollectionForm';
import PersonsList from './List';
import Others from './filters/Others';

const filterTabs = [
  { name: 'Others', element: Others },
];

class PersonsMainPage extends Component {

  static propTypes = {
    pageNo: PropTypes.number,
    total: PropTypes.number,
    items: PropTypes.arrayOf(shapes.Person),
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
    errOfCreate: null
  };

  state = {
    showFilters: false,
    newPerson: false,
  };

  componentWillReceiveProps(nextProps) {
    const { wipOfCreate } = this.props;
    const nWip            = nextProps.wipOfCreate;
    const nErr            = nextProps.errOfCreate;
    if (wipOfCreate && !nWip && !nErr) {
      this.toggleNewPerson();
    }
  }

  toggleFilters = () =>
    this.setState({ showFilters: !this.state.showFilters });

  toggleNewPerson = () =>
    this.setState({ newPerson: !this.state.newPerson });

  render() {
    const { showFilters, newPerson } = this.state;

    const
      {
        pageNo,
        total,
        items,
        wip,
        wipOfCreate,
        err,
        errOfCreate,
        onPageChange,
        onFiltersChange,
        onFiltersHydrated,
        create,
      } = this.props;

    return (
      <div>
        <Menu borderless size="large">
          <Menu.Item header>
            <Header content="Persons" size="medium" color="blue" />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item onClick={this.toggleFilters}>
              <Icon name="filter" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Menu.Item>
            <Menu.Item onClick={this.toggleNewPerson}>
              <Icon name="plus" />
              New Person
            </Menu.Item>
          </Menu.Menu>
        </Menu>

        <FiltersHydrator namespace={NS_PERSONS} onHydrated={onFiltersHydrated} />

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
              <FilterTags namespace={NS_PERSONS} onClose={onFiltersChange} />
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
                <Pagination pageNo={pageNo} total={total} onChange={onPageChange} />
              </div>
              <PersonsList items={items} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Modal
          closeIcon
          size="small"
          open={newPerson}
          onClose={this.toggleNewPerson}>
          <Modal.Header>Create New Person</Modal.Header>
          <Modal.Content>
            <CreateCollectionForm wip={wipOfCreate} err={errOfCreate} create={create} />
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default PersonsMainPage;