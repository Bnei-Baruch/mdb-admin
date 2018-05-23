import React, { Component } from 'react';
import { Header, Icon, Menu } from 'semantic-ui-react';

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

  renderList = () => {
    return <OperationsList items={this.props.items} />;
  };

  render() {
    const { showFilters } = this.state;
    return (
      <div>
        <Menu borderless size="large">
          <Menu.Item header>
            <Header content="Operations" size="medium" color="blue" />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item onClick={this.toggleFilters}>
              <Icon name="filter" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Menu.Item>
          </Menu.Menu>
        </Menu>

        {this.renderFiltersHydrator()}
        {this.renderContent()}
      </div>
    );
  }
}

export default FilesMainPage;
