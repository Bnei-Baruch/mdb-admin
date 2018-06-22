import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Segment } from 'semantic-ui-react';

import { NS_FILE_UNITS, CONTENT_UNIT_TYPES } from '../../../../helpers/consts';
import * as shapes from '../../../shapes';

import CUList from '../../../BaseClasses/CUList';
import ListWithCheckboxBase from '../../../BaseClasses/ListWithCheckboxBase';

class FileContentUnit extends ListWithCheckboxBase {

  static propTypes = {
    ...ListWithCheckboxBase.propTypes,
    file: shapes.File,
  };

  isSingleSelect = true;

  usedFiltersNames = ['FreeText', 'DateRange', 'Sources', 'Topics', 'Others'];

  getNamespace = () => NS_FILE_UNITS;

  getContentType = () => CONTENT_UNIT_TYPES;

  renderList = () => {
    const { currentLanguage, items, file } = this.props;
    return (<CUList
      {...this.getSelectListProps()}
      items={items}
      associatedIds={[file.content_unit_id]}
      hasSelectAll={false}
      currentLanguage={currentLanguage} />);
  };

  toggleFilters = (isShow) => {
    const showFilters = (typeof isShow === 'boolean') ? isShow : !this.state.showFilters;
    this.setState({ showFilters });
  };

  associate = () => {
    const { file, updateProperties } = this.props;
    updateProperties(file.id, { content_unit_id: this.state.selectedIds[0] });
    this.selectItem({});
  };

  render() {
    const { file }                     = this.props;
    const { showFilters, selectedIds } = this.state;

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
            disabled={selectedIds.length === 0}
            content="Associate content unit to this file"
            color="blue" />
          <Button
            onClick={this.toggleFilters}
            color="blue"
            inverted>
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

export default FileContentUnit;
