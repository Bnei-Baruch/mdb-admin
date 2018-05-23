import React from 'react';
import PropTypes from 'prop-types';
import { Header, Icon, Menu, Modal } from 'semantic-ui-react';

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

  renderList = () => {
    const { items, currentLanguage } = this.props;
    return <ContentUnitList items={items} currentLanguage={currentLanguage} />;
  };

  render() {
    const { showFilters, showNewCU }            = this.state;
    const { wipOfCreate, errOfCreate, create, } = this.props;

    return (
      <div>
        <Menu borderless size="large">
          <Menu.Item header>
            <Header content="Content Units" size="medium" color="blue" />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item onClick={this.toggleFilters}>
              <Icon name="filter" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Menu.Item>
            <Menu.Item onClick={this.toggleNewCU}>
              <Icon name="plus" />
              New Content Unit
            </Menu.Item>
          </Menu.Menu>
        </Menu>

        {this.renderFiltersHydrator()}
        {this.renderContent()}

        <Modal
          closeIcon
          size="small"
          open={showNewCU}
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
