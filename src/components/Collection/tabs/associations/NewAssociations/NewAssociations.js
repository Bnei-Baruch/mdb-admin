import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Header, Icon, Label, Segment } from 'semantic-ui-react';

import { EMPTY_ARRAY, NS_COLLECTION_UNITS } from '../../../../../helpers/consts';
import { formatError } from '../../../../../helpers/utils';
import * as shapes from '../../../../shapes';
import FiltersHydrator from '../../../../Filters/FiltersHydrator/FiltersHydrator';
import FilterTags from '../../../../Filters/FilterTags/FilterTags';
import TabsMenu from '../../../../shared/TabsMenu';
import Pagination from '../../../../shared/Pagination';
import ResultsPageHeader from '../../../../shared/ResultsPageHeader';
import ContentUnitList from './NewAssociationsList';
import DateRange from '../filters/DateRange';
import Others from '../filters/Others';

const filterTabs = [
  { name: 'Date Range', element: DateRange },
  { name: 'Others', element: Others },
];

class NewAssociations extends PureComponent {

  static propTypes = {
    pageNo: PropTypes.number,
    total: PropTypes.number,
    items: PropTypes.arrayOf(shapes.ContentUnit),
    wip: PropTypes.bool,
    err: shapes.Error,
    associate: PropTypes.func.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onFiltersChange: PropTypes.func.isRequired,
    onFiltersHydrated: PropTypes.func.isRequired,
    setEditMode: PropTypes.func.isRequired,
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

  toggleFilters = () =>
    this.setState({ showFilters: !this.state.showFilters });

  handleViewMode = () =>
    this.props.setEditMode(false);

  render() {
    const { showFilters } = this.state;

    const {
            pageNo,
            total,
            wip,
            err,
            onPageChange,
            onFiltersChange,
            onFiltersHydrated,
            associate,
          } = this.props;

    return (
      <div>
        <Segment clearing secondary size="large">
          <div>
            Associate content units to this collection
            <Button
              onClick={this.handleViewMode}
              floated="right"
              icon="close"
              content="Cancel"
            />
          </div>
        </Segment>

        <Segment clearing vertical>
          <Button
            onClick={associate}
            floated="right"
            content="Associate content units to this collection"
            color="blue"
          />
          <Button
            onClick={this.toggleFilters}
            color="blue"
            floated="right"
            inverted
          >
            <Icon name="filter" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
        </Segment>

        <FiltersHydrator namespace={NS_COLLECTION_UNITS} onHydrated={onFiltersHydrated} />

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
              <FilterTags namespace={NS_COLLECTION_UNITS} onClose={onFiltersChange} />
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
              <ContentUnitList {...this.props} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default NewAssociations;
