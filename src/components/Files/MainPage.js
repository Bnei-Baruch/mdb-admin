import React, { Component } from 'react';
import { Header, Icon, Menu } from 'semantic-ui-react';

import { NS_FILES, CONTENT_UNIT_TYPES } from '../../helpers/consts';
import ListWithFiltersBase from '../BaseClasses/ListWithFiltersBase';
import FilesList from './List';

class FilesMainPage extends ListWithFiltersBase {

  usedFiltersNames = ['FreeText', 'DateRange', 'Sources', 'Topics', 'Others'];

  getNamespace = () => NS_FILES;

  getContentType = () => CONTENT_UNIT_TYPES;

  renderList = () => {
    return <FilesList items={this.props.items} />;
  };

  getIsUpdateQuery = () => true;

  render() {
    const { showFilters } = this.state;

    return (
      <div>
        <Menu borderless size="large">
          <Menu.Item header>
            <Header content="Files" size="medium" color="blue" />
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
