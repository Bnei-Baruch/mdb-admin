import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Menu, Modal } from 'semantic-ui-react';

import { NS_UNITS, CONTENT_UNIT_TYPES } from '../../helpers/consts';
import * as shapes from '../shapes';
import CUList from '../BaseClasses/CUList';
import ListWithFiltersBase from '../BaseClasses/ListWithFiltersBase';
import CreateContentUnitForm from '../shared/Forms/ContentUnit/CreateContentUnitForm';
import ContentUnitFormAssociates from '../shared/Forms/ContentUnit/ContentUnitFormAssociates';

class ContentUnitMainPage extends ListWithFiltersBase {
  static propTypes = {
    ...ListWithFiltersBase.propTypes,
    wipOfCreate: PropTypes.bool,
    errOfCreate: shapes.Error,
    create: PropTypes.func.isRequired,
  };

  static defaultProps = {
    ...ListWithFiltersBase.defaultProps,
    wipOfCreate: false,
    errOfCreate: null
  };

  constructor(props) {
    super(props);
    this.state.showNewCU = false;
  }

  static getDerivedStateFromProps(props, state) {
    const { wipOfCreate, errOfCreate } = props;
    if (errOfCreate || wipOfCreate) {
      return { wip: true };
    }
    if (state.wip && !wipOfCreate && !errOfCreate) {
      return { showNewCU: !state.showNewCU, wip: false, associateLastOpen: true };
    }
    return null;
  }

  openNewCU = () => this.setState({ showNewCU: true });

  closeNewCU = (e) => this.setState({ showNewCU: false });

  closeAssociateLast = () => this.setState({ associateLastOpen: false });

  usedFiltersNames = ['FreeText', 'DateRange', 'Sources', 'Topics', 'Others', 'OriginalLanguage'];

  getNamespace = () => NS_UNITS;

  getContentType = () => CONTENT_UNIT_TYPES;

  getPageNo = this.props.getPageNo;

  getIsUpdateQuery = () => true;

  renderHeaderRightSide = () => {
    return (
      <Menu.Item onClick={this.openNewCU}>
        <Icon name="plus" />
        New Content Unit
      </Menu.Item>
    );
  };

  renderList = () => {
    const { items, currentLanguage, associatedIds } = this.props;

    return (
      <CUList
        items={items}
        associatedIds={associatedIds}
        currentLanguage={currentLanguage}
        withCheckBox={false}
      />
    );
  };

  renderAssociateLastCreated = () => {
    const { lastCreated }       = this.props;
    const { associateLastOpen } = this.state;
    console.log('ContentUnitFormAssociates renderAssociateLastCreated', lastCreated, associateLastOpen);
    if (!lastCreated || !associateLastOpen) {
      return null;
    }
    return <ContentUnitFormAssociates unit={lastCreated} onClose={this.closeAssociateLast} />;
  };

  render() {
    const { wipOfCreate, errOfCreate, create, lastCreated } = this.props;

    return (
      <div>
        {this.renderHeader('Content Units')}
        {this.renderFiltersHydrator()}
        {this.renderContent()}
        {this.renderAssociateLastCreated()}
        <Modal
          closeIcon
          centered={false}
          size="small"
          open={this.state.showNewCU}
          onClose={this.closeNewCU}
        >
          <Modal.Header>Create New Content Unit</Modal.Header>
          <Modal.Content>
            <CreateContentUnitForm wip={wipOfCreate} err={errOfCreate} create={create} />
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default ContentUnitMainPage;
