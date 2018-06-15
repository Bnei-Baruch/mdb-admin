import React from 'react';

import { NS_FILES, CONTENT_UNIT_TYPES } from '../../helpers/consts';
import ListWithFiltersBase from '../BaseClasses/ListWithFiltersBase';
import FileList from '../BaseClasses/FileList';

class FilesMainPage extends ListWithFiltersBase {

  usedFiltersNames = ['FreeText', 'DateRange', 'Sources', 'Topics', 'Others'];

  getNamespace = () => NS_FILES;

  getContentType = () => CONTENT_UNIT_TYPES;

  renderList = () => {
    return <FileList
      items={this.props.items}
      withCheckBox={false} />;
  };

  getIsUpdateQuery = () => true;

  render() {
    return (
      <div>
        {this.renderHeader('Files')}
        {this.renderFiltersHydrator()}
        {this.renderContent()}
      </div>
    );
  }
}

export default FilesMainPage;
