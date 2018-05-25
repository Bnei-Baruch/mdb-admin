import React, { PureComponent } from 'react';
import { Button, Icon, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import uniq from 'lodash/uniq';

import { EMPTY_ARRAY, EMPTY_OBJECT, NS_UNIT_FILE_UNITS, CONTENT_UNIT_TYPES } from '../../../../../helpers/consts';
import * as shapes from '../../../../shapes';
import { actions, selectors } from '../../../../../redux/modules/lists';
import { actions as cuActions, selectors as cuSelectors } from '../../../../../redux/modules/content_units';
import { selectors as filesSelectors } from '../../../../../redux/modules/files';
import FilesList from './List';

class AddFiles extends PureComponent {

  constructor(props) {
    super(props);
    AddFiles.propTypes = {
      ...super.propTypes,
      unit: shapes.ContentUnit,
      files: PropTypes.arrayOf(shapes.File),
      allFiles: PropTypes.arrayOf(shapes.File),
      setEditMode: PropTypes.func,
    };

    AddFiles.defaultProps = {
      ...super.defaultProps,
      allFiles: EMPTY_ARRAY,
    };

    this.state = {
      ...super.state,
      selectedFilesIds: []
    };

  }

  componentWillReceiveProps(nextProps) {
    if (this.props.wipAddFile && !nextProps.wipAddFile) {
      this.switchToViewMode();
    }
  }

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

  getNamespace = () => NS_UNIT_FILE_UNITS;

  getContentType = () => CONTENT_UNIT_TYPES;

  renderList = () => {
    const { unit, allFiles, files } = this.props;
    return (<FilesList
      unitId={unit.id}
      items={allFiles}
      currentFiles={files}
      handleSelectFile={this.selectFile}
      handleSelectAllFiles={this.selectAllFiles}
      selectedFilesIds={this.stste.selectedFilesIds}
    />);
  };

  render() {
    const { showFilters, selectedFilesIds } = this.state;
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

        {this.renderFiltersHydrator()}
        {this.renderContent()}
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
