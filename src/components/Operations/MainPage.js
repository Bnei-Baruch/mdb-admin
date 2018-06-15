import React from 'react';

import { NS_OPERATIONS } from '../../helpers/consts';
import ListWithFiltersBase from '../BaseClasses/ListWithFiltersBase';
import OperationsList from './List';
import Others from './filters/Others';

class FilesMainPage extends ListWithFiltersBase {

  constructor(props) {
    super(props);
    this.setCustomFilter('Others', { name: 'Others', element: Others });
  }

  usedFiltersNames = ['FreeText', 'DateRange', 'Sources', 'Topics', 'Others'];

  getNamespace = () => NS_OPERATIONS;

  getContentType = () => true;

  getIsUpdateQuery = () => true;

  renderList = () => {
    return <OperationsList items={this.props.items} />;
  };

  render() {
    return (
      <div>
        {this.renderHeader('Operations')}
        {this.renderFiltersHydrator()}
        {this.renderContent()}
      </div>
    );
  }
}

export default FilesMainPage;
