import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Menu, Modal } from 'semantic-ui-react';

import { NS_COLLECTIONS, COLLECTION_TYPES } from '../../helpers/consts';
import * as shapes from '../shapes';
import CreateCollectionForm from '../shared/Forms/Collection/CreateCollectionForm';
import ListWithFiltersBase from '../BaseClasses/ListWithFiltersBase';
import CollectionsList from '../BaseClasses/CollectionList';

class CollectionsMainPage extends ListWithFiltersBase {

  constructor(props) {
    super(props);
    CollectionsMainPage.propTypes = {
      ...super.propTypes,
      items: PropTypes.arrayOf(shapes.Collection),
      wipOfCreate: PropTypes.bool,
      errOfCreate: shapes.Error,
      create: PropTypes.func.isRequired,
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

  getIsUpdateQuery = () => true;

  renderHeaderRightSide = () => {
    return (
      <Menu.Item onClick={this.toggleNewCollection}>
        <Icon name="plus" />
        New Collection
      </Menu.Item>
    );
  };

  renderList = () => {
    return <CollectionsList items={this.props.items} withCheckBox={false} />;
  };

  render() {
    const { wipOfCreate, errOfCreate, create } = this.props;

    return (
      <div>
        {this.renderHeader('Collections')}
        {this.renderFiltersHydrator()}
        {this.renderContent()}

        <Modal
          closeIcon
          size="small"
          open={this.state.newCollection}
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
