import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Menu, Modal } from 'semantic-ui-react';

import { NS_UNITS, CONTENT_UNIT_TYPES } from '../../helpers/consts';
import * as shapes from '../shapes';
import CreateContentUnitForm from '../shared/Forms/ContentUnit/CreateContentUnitForm';
import ListWithFiltersBase from '../BaseClasses/ListWithFiltersBase';
import ContentUnitList from './List';

class ContentUnitMainPage extends ListWithFiltersBase {

  constructor(props) {
    super(props);
    ContentUnitMainPage.propTypes = {
      ...super.propTypes,
      items: PropTypes.arrayOf(shapes.ContentUnit),
      wipOfCreate: PropTypes.bool,
      errOfCreate: shapes.Error,
      create: PropTypes.func.isRequired,
    };

    ContentUnitMainPage.defaultProps = {
      ...super.defaultProps,
      wipOfCreate: false,
      errOfCreate: null
    };

    this.state = {
      ...super.state,
      showNewCU: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { wipOfCreate } = this.props;
    const nWip            = nextProps.wipOfCreate;
    const nErr            = nextProps.errOfCreate;
    if (wipOfCreate && !nWip && !nErr) {
      this.toggleNewCU();
    }
  }

  toggleNewCU = () =>
    this.setState({ showNewCU: !this.state.showNewCU });

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
    const { items, currentLanguage } = this.props;
    return <ContentUnitList items={items} currentLanguage={currentLanguage} />;
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
