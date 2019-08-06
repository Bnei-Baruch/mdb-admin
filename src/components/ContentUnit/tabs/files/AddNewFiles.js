import React from 'react';
import { Button, Icon, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { EMPTY_ARRAY, EMPTY_OBJECT, NS_UNIT_FILE_UNITS } from '../../../../helpers/consts';
import { actions, selectors } from '../../../../redux/modules/lists';
import { actions as cuActions, selectors as cuSelectors } from '../../../../redux/modules/content_units';
import { selectors as filesSelectors } from '../../../../redux/modules/files';
import * as shapes from '../../../shapes';
import ListWithCheckboxBase from '../../../BaseClasses/ListWithCheckboxBase';
import FileList from '../../../BaseClasses/FileList';

class AddNewFiles extends ListWithCheckboxBase {
  static propTypes = {
    ...ListWithCheckboxBase.propTypes,
    unit: shapes.ContentUnit,
    items: PropTypes.arrayOf(shapes.File),
    setEditMode: PropTypes.func,
    wip: false
  };

  static getDerivedStateFromProps(props, state) {
    if (props.wipAddFile) {
      return { wip: true };
    }

    if (!props.wipAddFile && state.wip) {
      props.setEditMode(false);
      return { selectedIds: [], wip: false };
    }
    return null;
  }

  toggleFilters = () => this.setState({ showFilters: !this.state.showFilters });

  switchToViewMode = () => {
    this.props.setEditMode(false);
    this.setState({ selectedIds: [] });
  };

  addFiles = () => {
    const { selectedIds }    = this.state;
    const { unit, addFiles } = this.props;
    if (selectedIds.length === 0) {
      return;
    }
    addFiles(unit.id, selectedIds);
  };

  getNamespace = () => NS_UNIT_FILE_UNITS;

  getContentType = () => null;

  renderList = () => {
    const { unit, items } = this.props;
    return (
      <FileList
        {...this.getSelectListProps()}
        items={items}
        associatedIds={unit.files}
      />
    );
  };

  render() {
    const { showFilters, selectedIds } = this.state;
    return (
      <div>
        <Segment clearing secondary size="large">
          Add Files To Content Unit
        </Segment>
        <Segment clearing vertical>
          <Button
            inverted
            color="blue"
            onClick={this.toggleFilters}
          >
            <Icon name="filter" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>

          <Button
            content="Add files to this content unit"
            disabled={selectedIds.length === 0}
            color="blue"
            onClick={this.addFiles}
          />
          <Button
            content="Cancel"
            icon="close"
            onClick={this.switchToViewMode}
          />
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
    items: Array.isArray(status.items) && status.items.length > 0 ? denormIDs(status.items) : EMPTY_ARRAY,
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

export default connect(mapState, mapDispatch)(AddNewFiles);
