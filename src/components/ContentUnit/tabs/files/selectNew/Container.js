import React, { PureComponent } from 'react';
import { Button, Grid, Header, Icon, Label, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import uniq from 'lodash/uniq';

import { EMPTY_ARRAY, EMPTY_OBJECT, NS_UNIT_FILE_UNITS, CONTENT_UNIT_TYPES } from '../../../../../helpers/consts';
import { formatError } from '../../../../../helpers/utils';
import * as shapes from '../../../../shapes';
import TabsMenu from '../../../../shared/TabsMenu';
import Pagination from '../../../../shared/Pagination';
import ResultsPageHeader from '../../../../shared/ResultsPageHeader';
import { actions, selectors } from '../../../../../redux/modules/lists';
import { actions as cuActions, selectors as cuSelectors } from '../../../../../redux/modules/content_units';
import { selectors as filesSelectors } from '../../../../../redux/modules/files';
import FilesList from './List';

import FiltersHydrator from '../../../../Filters/FiltersHydrator/FiltersHydrator';
import FilterTags from '../../../../Filters/FilterTags/FilterTags';
import DateRange from '../../../../Filters/DateRange';
import FreeText from '../../../../Filters/FreeText';
import Others from '../../../../Filters/Others';

const filterTabs = [
  { name: 'Date Range', element: DateRange, namespace: NS_UNIT_FILE_UNITS },
  { name: 'Free Text', element: FreeText, namespace: NS_UNIT_FILE_UNITS },
  { name: 'Others', element: Others, namespace: NS_UNIT_FILE_UNITS, contentTypes: CONTENT_UNIT_TYPES },
];

class AddFiles extends PureComponent {

  static propTypes = {
    total: PropTypes.number,
    unit: shapes.ContentUnit,
    files: PropTypes.arrayOf(shapes.File),
    allFiles: PropTypes.arrayOf(shapes.File),
    setEditMode: PropTypes.func,
    wip: PropTypes.bool,
    err: shapes.Error,
  };

  static defaultProps = {
    allFiles: EMPTY_ARRAY,
    pageNo: 1,
    total: 0,
    wip: false,
    err: null,
  };

  state = {
    showFilters: false,
    selectedFilesIds: []
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.wipAddFile && !nextProps.wipAddFile) {
      this.switchToViewMode();
    }
  }

  handlePageChange = (pageNo) => {
    const { setPage, fetchList } = this.props;
    setPage(NS_UNIT_FILE_UNITS, pageNo);
    fetchList(NS_UNIT_FILE_UNITS, pageNo);
  };

  handleFiltersCancel = () => this.toggleFilters();

  handleFiltersChange = (isToggle = true) => {
    if (isToggle) {
      this.toggleFilters();
    }
    this.handlePageChange(1);
  };
  handleFiltersHydrated = () => {
    this.handlePageChange(1);
  };

  selectFile = (file) => {
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

  selectAllFiles = (checked) => {
    const { items, files }     = this.props;
    const { selectedFilesIds } = this.state;
    if (checked) {
      this.setState({ selectedFilesIds: uniq([...selectedFilesIds, ...items.filter(id => files.every(f => f.id !== id))]) });
    } else {
      this.setState({ selectedFilesIds: selectedFilesIds.filter(x => !items.includes(x)) });
    }
  };

  toggleFilters = () =>
    this.setState({ showFilters: !this.state.showFilters });

  switchToViewMode = () => {
    this.props.setEditMode(false);
    this.setState({ selectedFilesIds: [] });
  };

  addFiles = () => {
    const { selectedFilesIds } = this.state;
    const { unit, addFiles }   = this.props;
    if (!selectedFilesIds) {
      return;
    }
    addFiles(unit.id, selectedFilesIds);
  };

  render() {
    const {
            showFilters,
            selectedFilesIds
          } = this.state;
    const {
            pageNo,
            total,
            wip,
            err,
            unit,
            allFiles,
            wipAddFile,
            files
          } = this.props;
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
                      <TabsMenu items={filterTabs} onFilterApplication={this.handleFiltersChange} onFilterCancel={this.handleFiltersCancel}  />
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
                <div style={{ float: 'left' }}>
                  {
                    wip || wipAddFile ?
                      <Label color="yellow" icon={{ name: 'spinner', loading: true }} content="Loading" /> :
                      null
                  }
                  {
                    err ?
                      <Header inverted content={formatError(err)} color="red" icon="warning sign" floated="left" /> :
                      null
                  }
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <FilesList
                unitId={unit.id}
                items={allFiles}
                currentFiles={files}
                handleSelectFile={this.selectFile}
                handleSelectAllFiles={this.selectAllFiles}
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
    allFiles: Array.isArray(status.items) && status.items.length > 0 ? denormIDs(status.items) : EMPTY_ARRAY,
    wip: filesSelectors.getWIP(state.files, 'fetchItem'),
    err: filesSelectors.getError(state.files, 'fetchItem'),
    wipAddFile: cuSelectors.getWIP(state.content_units, 'addFiles'),
    errAddFile: cuSelectors.getError(state.content_units, 'addFiles'),
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
