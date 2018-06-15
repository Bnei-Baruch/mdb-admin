import React from 'react';
import { Button, Icon, Segment, Menu, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { EMPTY_ARRAY, EMPTY_OBJECT, NS_UNIT_FILE_UNITS, CONTENT_UNIT_TYPES } from '../../../../helpers/consts';
import * as shapes from '../../../shapes';
import { actions, selectors } from '../../../../redux/modules/lists';
import { actions as cuActions, selectors as cuSelectors } from '../../../../redux/modules/content_units';
import { selectors as filesSelectors } from '../../../../redux/modules/files';

import ListWithCheckboxBase from '../../../BaseClasses/ListWithCheckboxBase';
import FileList from '../../../BaseClasses/FileList';

class AddNewFiles extends ListWithCheckboxBase {

  static propTypes = {
    ...ListWithCheckboxBase.propTypes,
    unit: shapes.ContentUnit,
    items: PropTypes.arrayOf(shapes.File),
    setEditMode: PropTypes.func,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.wipAddFile && !nextProps.wipAddFile) {
      this.switchToViewMode();
    }
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

  getContentType = () => CONTENT_UNIT_TYPES;

  renderList = () => {
    const { unit, items } = this.props;
    return (<FileList
      {...this.getSelectListProps()}
      items={items}
      associatedIds={unit.files}
    />);
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
            onClick={this.toggleFilters}
            color="blue"
            inverted>
            <Icon name="filter" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>

          <Button
            onClick={this.addFiles}
            disabled={selectedIds.length === 0}
            content="Add files to this content unit"
            color="blue" />
          <Button
            onClick={this.switchToViewMode}
            icon="close"
            content="Cancel" />
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
