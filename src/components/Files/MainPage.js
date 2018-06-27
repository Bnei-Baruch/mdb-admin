import React from 'react';

import { NS_FILES } from '../../helpers/consts';
import ListWithFiltersBase from '../BaseClasses/ListWithFiltersBase';
import FileList from '../BaseClasses/FileList';

class FilesMainPage extends ListWithFiltersBase {

  usedFiltersNames = ['FreeText', 'DateRange', 'Others'];

  getNamespace = () => NS_FILES;

  getContentType = () => null;

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
