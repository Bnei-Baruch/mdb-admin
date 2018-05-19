import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Grid, Header, Icon, Label, Segment } from 'semantic-ui-react';

import { EMPTY_ARRAY, NS_FILE_UNITS, CONTENT_UNIT_TYPES } from '../../../../helpers/consts';
import { formatError } from '../../../../helpers/utils';
import * as shapes from '../../../shapes';
import TabsMenu from '../../../shared/TabsMenu';
import Pagination from '../../../shared/Pagination';
import ResultsPageHeader from '../../../shared/ResultsPageHeader';
import ContentUnitList from './NewAssociationsList';

import FiltersHydrator from '../../../Filters/FiltersHydrator/FiltersHydrator';
import FilterTags from '../../../Filters/FilterTags/FilterTags';
import FreeText from '../../../Filters/FreeText';
import DateRange from '../../../Filters/DateRange';
import Others from '../../../Filters/Others';

const filterTabs = [
  { name: 'Free Text', element: FreeText },
  { name: 'Date Range', element: DateRange },
  { name: 'Others', element: Others, namespace: NS_FILE_UNITS, contentTypes: CONTENT_UNIT_TYPES },
];

class FileContentUnit extends PureComponent {

  static propTypes = {
    total: PropTypes.number,
    item: shapes.ContentUnit,
    wip: PropTypes.bool,
    err: shapes.Error,
    file: shapes.File,
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

  handlePageChange = (pageNo) => {
    const { setPage, fetchList } = this.props;
    setPage(NS_FILE_UNITS, pageNo);
    fetchList(NS_FILE_UNITS, pageNo);
  };

  handleFiltersChange = () => {
    this.handlePageChange(1);
  };

  handleFiltersCancel = () => {
    this.handlePageChange(1);
    this.toggleFilters();
  };

  handleChangeFilterFromTag;

  handleFiltersHydrated = () => {
    this.handlePageChange(1);
  };

  handleSelectCU = (cu) => this.setState({ selectedCUId: cu.id });

  toggleFilters = (isShow) => {
    const showFilters = isShow === undefined ? !this.state.showFilters : isShow;
    this.setState({ showFilters });
  };

  associate = () => {
    const { selectedCUId }           = this.state;
    const { file, updateProperties } = this.props;
    if (!selectedCUId) {
      return;
    }
    updateProperties(file.id, { content_unit_id: selectedCUId });
    this.handleSelectCU({});
  };

  render() {
    const { showFilters, selectedCUId }            = this.state;
    const { pageNo, total, wip, err, file, items } = this.props;

    return (
      <div>
        <Segment clearing secondary size="large">
          <div>
            <Link to={`/content_units/${file.content_unit_id}`}>
              Content unit currently associated with this file. Id: {file.content_unit_id}.
            </Link>
          </div>
        </Segment>

        <Segment clearing vertical>
          <Button
            onClick={this.associate}
            disabled={!selectedCUId}
            floated="right"
            content="Associate content unit to this file"
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

        <FiltersHydrator namespace={NS_FILE_UNITS} onHydrated={this.handleFiltersHydrated} />

        <Grid>
          <Grid.Row>
            <Grid.Column>
              {
                showFilters ?
                  <div>
                    <TabsMenu items={filterTabs} onFilterApplication={this.handleFiltersChange} onFilterCancel={this.handleFiltersCancel} />
                    <br />
                  </div> :
                  null
              }
              <FilterTags namespace={NS_FILE_UNITS} changeFilterFromTag={this.handleChangeFilterFromTag} />
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
                associatedCUId={file.content_unit_id}
                items={items}
                handleSelectCU={this.handleSelectCU}
                selectedCUId={selectedCUId}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default FileContentUnit;
