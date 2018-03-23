import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Header, Icon, Label, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { EMPTY_ARRAY, EMPTY_OBJECT, NS_UNIT_FILE_UNITS } from '../../../../../helpers/consts';
import { formatError } from '../../../../../../helpers/utils';
import * as shapes from '../../../../../shapes';
import FiltersHydrator from '../../../../../Filters/FiltersHydrator/FiltersHydrator';
import FilterTags from '../../../../../Filters/FilterTags/FilterTags';
import TabsMenu from '../../../../../shared/TabsMenu';
import Pagination from '../../../../../shared/Pagination';
import ResultsPageHeader from '../../../../../shared/ResultsPageHeader';

import FilesList from './List';
import DateRange from '../filters/DateRange';
import Others from '../filters/Others';

const filterTabs = [
  { name: 'Date Range', element: DateRange },
  { name: 'Others', element: Others },
];

class AddNewController extends PureComponent {

  static propTypes = {
    total: PropTypes.number,
    unit: shapes.ContentUnit.required,
    files: PropTypes.arrayOf(shapes.File),
    unitFiles: PropTypes.arrayOf(shapes.File),
    wip: PropTypes.bool,
    err: shapes.Error,
  };

  static defaultProps = {
    files: EMPTY_ARRAY,
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
    setPage(NS_UNIT_FILE_UNITS, pageNo);
    fetchList(NS_UNIT_FILE_UNITS, pageNo);
  };

  handleFiltersChange = () => {
    this.handlePageChange(1);
  };

  handleFiltersHydrated = () => {
    this.handlePageChange(1);
  };

  handleSelectFile = (file) => this.setState({ selectedFilesId: file.id });

  toggleFilters = () =>
    this.setState({ showFilters: !this.state.showFilters });

  associate = () => {
    const { selectedFilesId } = this.state;
    const { unit, addFiles }  = this.props;
    if (!selectedFilesId) {
      return;
    }
    addFiles(unit.id, selectedFilesId);
    this.handleSelectFile({});
  };

  render() {
    const { showFilters, selectedFilesId }         = this.state;
    const { pageNo, total, wip, err, unit, files } = this.props;
    const filesLinks                               = files.map(f => (
      <Link to={`/files/${f.id}`} content={f.id} />));
    return (
      <div>
        <Segment clearing secondary size="large">
          <div>
            Files currently associated with this content unit . Ids: {filesLinks}.
          </div>
        </Segment>

        <Segment clearing vertical>
          <Button
            onClick={this.associate}
            disabled={!selectedFilesId}
            floated="right"
            content="Associate files to this content unit"
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

        <FiltersHydrator namespace={NS_UNIT_FILE_UNITS} onHydrated={this.handleFiltersHydrated} />

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
              <FilterTags namespace={NS_UNIT_FILE_UNITS} onClose={this.handleFiltersChange} />
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
              <FilesList
                unitId={unit.id}
                items={files}
                handleSelectFile={this.handleSelectFile}
                selectedFilesId={selectedFilesId}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

const mapState = (state) => {
  const status    = selectors.getNamespaceState(state.lists, NS_UNIT_FILE_UNITS) || EMPTY_OBJECT;
  const denormIDs = filesSelectors.denormIDs(state.files);
  return {
    ...status,
    items: Array.isArray(status.items) && status.items.length > 0 ? denormIDs(status.items) : EMPTY_ARRAY,
    unitFilesIds: EMPTY_ARRAY
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchList: actions.fetchList,
    setPage: actions.setPage,
    addFiles: cuActions.addFiles,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(AddNewController);
