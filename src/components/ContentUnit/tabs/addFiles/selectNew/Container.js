import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Header, Icon, Label, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { EMPTY_ARRAY, EMPTY_OBJECT, NS_UNIT_FILE_UNITS } from '../../../../../helpers/consts';
import { formatError } from '../../../../../helpers/utils';
import * as shapes from '../../../../shapes';
import FiltersHydrator from '../../../../Filters/FiltersHydrator/FiltersHydrator';
import FilterTags from '../../../../Filters/FilterTags/FilterTags';
import TabsMenu from '../../../../shared/TabsMenu';
import Pagination from '../../../../shared/Pagination';
import ResultsPageHeader from '../../../../shared/ResultsPageHeader';
import { actions, selectors } from '../../../../../redux/modules/lists';
import { actions as cuActions } from '../../../../../redux/modules/content_units';
import { selectors as filesSelectors } from '../../../../../redux/modules/files';

import FilesList from './List';
import DateRange from '../filters/DateRange';
import Others from '../filters/Others';

const filterTabs = [
  { name: 'Date Range', element: DateRange },
  { name: 'Others', element: Others },
];

class AddFiles extends PureComponent {

  static propTypes = {
    total: PropTypes.number,
    unit: shapes.ContentUnit,
    files: PropTypes.arrayOf(shapes.File),
    setEditMode: PropTypes.func,
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
    selectedFilesIds: []
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

  handleSelectFile = (file) => {
    const { selectedFilesIds } = this.state;
    if (selectedFilesIds.includes(file.id)) {
      selectedFilesIds.some((id, i, arr) => {
        if (id === file.id) {
          arr.splice(i, 1);
          return true;
        }
      });
    } else {
      selectedFilesIds.push(file.id);
    }

    this.setState({ selectedFilesIds: [...selectedFilesIds] });
  };

  toggleFilters = () =>
    this.setState({ showFilters: !this.state.showFilters });

  switchToViewMode = () => {
    this.props.setEditMode(false);
    this.handleSelectFile({});
  };

  addFiles = () => {
    const { selectedFilesIds } = this.state;
    const { unit, addFiles }   = this.props;
    if (!selectedFilesIds) {
      return;
    }
    addFiles(unit.id, selectedFilesIds);
    this.switchToViewMode();
  };

  render() {
    const { showFilters, selectedFilesIds }        = this.state;
    const { pageNo, total, wip, err, unit, files } = this.props;
    return (
      <div>
        <Segment clearing vertical>
          <Button
            onClick={this.switchToViewMode}
            floated="right"
            content="Cancel"
          />
          <Button
            onClick={this.addFiles}
            disabled={selectedFilesIds.length === 0}
            floated="right"
            content="Add files to this content unit"
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
              <div>

                {
                  showFilters ?
                    <div>
                      <TabsMenu items={filterTabs} onFilterApplication={this.handleFiltersChange} />
                      <br />
                    </div> :
                    null
                }
                <FilterTags namespace={NS_UNIT_FILE_UNITS} onClose={this.handleFiltersChange} />
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <div style={{ textAlign: 'right' }}>

                <ResultsPageHeader pageNo={pageNo} total={total} />
                &nbsp;&nbsp;
                <Pagination pageNo={pageNo} total={total} onChange={this.handlePageChange} />
              </div>
              <div>
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
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <FilesList
                unitId={unit.id}
                items={files}
                handleSelectFile={this.handleSelectFile}
                selectedFilesIds={selectedFilesIds}
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
    files: Array.isArray(status.items) && status.items.length > 0 ? denormIDs(status.items) : EMPTY_ARRAY,
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchList: actions.fetchList,
    setPage: actions.setPage,
    addFiles: cuActions.addFiles,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(AddFiles);
