import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Menu, Modal } from 'semantic-ui-react';

import { NS_UNITS, CONTENT_UNIT_TYPES } from '../../helpers/consts';
import * as shapes from '../shapes';

import CUList from '../BaseClasses/CUList';
import ListWithFiltersBase from '../BaseClasses/ListWithFiltersBase';
import CreateContentUnitForm from '../shared/Forms/ContentUnit/CreateContentUnitForm';

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

  componentWillReceiveProps(nextProps) {
    const { wipOfCreate } = this.props;

    const nWip = nextProps.wipOfCreate;
    const nErr = nextProps.errOfCreate;
    if (wipOfCreate && !nWip && !nErr) {
      this.toggleNewCU();
    }
  }

  toggleNewCU = () => this.setState({ showNewCU: !this.state.showNewCU });

  usedFiltersNames = ['FreeText', 'DateRange', 'Sources', 'Topics', 'Others'];

  getNamespace = () => NS_UNITS;

  getContentType = () => CONTENT_UNIT_TYPES;

  getPageNo = this.props.getPageNo;

  getIsUpdateQuery = () => true;

  renderHeaderRightSide = () => {
    return (
      <Menu.Item onClick={this.toggleNewCU}>
        <Icon name="plus" />
        New Content Unit
      </Menu.Item>
    );
  };

  renderList = () => {
    const { items, currentLanguage, associatedIds } = this.props;

    return (<CUList
      items={items}
      associatedIds={associatedIds}
      currentLanguage={currentLanguage}
      withCheckBox={false} />);
  };

  render() {
    const { wipOfCreate, errOfCreate, create, } = this.props;

    return (
      <div>
        {this.renderHeader('Content Units')}
        {this.renderFiltersHydrator()}
        {this.renderContent()}

        <Modal
          closeIcon
          centered={false}
          size="small"
          open={this.state.showNewCU}
          onClose={this.toggleNewCU}>
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
