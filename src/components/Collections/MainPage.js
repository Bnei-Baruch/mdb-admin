import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Icon, Menu, Modal } from 'semantic-ui-react';

import { NS_COLLECTIONS, COLLECTION_TYPES } from '../../helpers/consts';
import * as shapes from '../shapes';
import CreateCollectionForm from '../shared/Forms/Collection/CreateCollectionForm';
import ListWithFiltersBase from '../BaseClasses/ListWithFiltersBase';
import CollectionsList from './List';

class CollectionsMainPage extends ListWithFiltersBase {

  constructor(props) {
    super(props);
    CollectionsMainPage.propTypes = {
      ...super.propTypes,
      items: PropTypes.arrayOf(shapes.Collection),
      wipOfCreate: PropTypes.bool,
      errOfCreate: shapes.Error,
      create: PropTypes.func.isRequired,
      getTagByUID: PropTypes.func.isRequired,
    };

    CollectionsMainPage.defaultProps = {
      ...super.defaultProps,
      wipOfCreate: false,
      errOfCreate: null
    };

    this.state = {
      ...super.state,
      newCollection: false,
    };

  }

  componentWillReceiveProps(nextProps) {
    const { wipOfCreate } = this.props;
    const nWip            = nextProps.wipOfCreate;
    const nErr            = nextProps.errOfCreate;
    if (wipOfCreate && !nWip && !nErr) {
      this.toggleNewCollection();
    }
  }

  toggleNewCollection = () => this.setState({ newCollection: !this.state.newCollection });

  getNamespace = () => NS_COLLECTIONS;

  getContentType = () => COLLECTION_TYPES;

  getPageNo = this.props.getPageNo;

  renderList = () => {
    const { items, currentLanguage, getTagByUID } = this.props;
    return <CollectionsList items={items} getTagByUID={getTagByUID} currentLanguage={currentLanguage} />;
  };

  render() {
    const { showFilters, newCollection }       = this.state;
    const { wipOfCreate, errOfCreate, create } = this.props;

    return (
      <div>
        <Menu borderless size="large">
          <Menu.Item header>
            <Header content="Collections" size="medium" color="blue" />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item onClick={this.toggleFilters}>
              <Icon name="filter" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Menu.Item>
            <Menu.Item onClick={this.toggleNewCollection}>
              <Icon name="plus" />
              New Collection
            </Menu.Item>
          </Menu.Menu>
        </Menu>

        {this.renderFiltersHydrator()}
        {this.renderContent()}

        <Modal
          closeIcon
          size="small"
          open={newCollection}
          onClose={this.toggleNewCollection}>
          <Modal.Header>Create New Collection</Modal.Header>
          <Modal.Content>
            <CreateCollectionForm wip={wipOfCreate} err={errOfCreate} create={create} />
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default CollectionsMainPage;
