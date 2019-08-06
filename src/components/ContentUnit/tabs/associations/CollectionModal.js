import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Icon, Menu, Button, Modal
} from 'semantic-ui-react';

import {
  EMPTY_ARRAY,
  EMPTY_OBJECT,
  NS_UNIT_ASSOCIATION_COLLECTION,
  COLLECTION_TYPES
} from '../../../../helpers/consts';
import { actions, selectors } from '../../../../redux/modules/lists';
import { selectors as collections } from '../../../../redux/modules/collections';

import * as shapes from '../../../shapes';
import ListWithCheckboxBase from '../../../BaseClasses/ListWithCheckboxBase';
import CollectionList from '../../../BaseClasses/CollectionList';

class CollectionModal extends ListWithCheckboxBase {
  static propTypes = {
    ...ListWithCheckboxBase.propTypes,
    unit: shapes.ContentUnit,
    items: PropTypes.arrayOf(shapes.Collection),
    associatedIds: PropTypes.arrayOf(PropTypes.number),
  };

  componentDidMount() {
    this.askForData(1);
  }

  static getDerivedStateFromProps(props, state) {
    const { wipAssociate, unit, handleShowAssociateModal } = props;
    if (wipAssociate) {
      return { wip: true };
    }

    if (unit && state.wip && !wipAssociate) {
      props.fetchList(NS_UNIT_ASSOCIATION_COLLECTION, 1);
      handleShowAssociateModal();
      return { selectedIds: [], showFilters: false, wip: false };
    }
  }

  getNamespace = () => NS_UNIT_ASSOCIATION_COLLECTION;

  getContentType = () => COLLECTION_TYPES;

  renderList = () => {
    const { associatedIds, items } = this.props;
    return (
      <CollectionList
        {...this.getSelectListProps()}
        items={items}
        selectedIds={this.state.selectedIds}
        associatedIds={associatedIds}
      />
    );
  };

  askForData = pageNo =>
    this.props.fetchList(NS_UNIT_ASSOCIATION_COLLECTION, pageNo);

  handleAssociate = () => {
    const { associate, unit } = this.props;
    this.state.selectedIds.forEach(cId => associate(cId, [{
      content_unit_id: unit.id,
      name: '',
      position: 0
    }]));
  };

  handleClose = () => {
    this.setState({ selectedIds: [], showFilters: false });
    this.props.handleShowAssociateModal();
  };

  render() {
    const { showFilters }          = this.state;
    const { isShowAssociateModal } = this.props;
    if (!isShowAssociateModal) {
      return null;
    }
    return (
      <Modal
        closeIcon
        centered={false}
        size="fullscreen"
        open={isShowAssociateModal}
        onClose={this.handleClose}
      >
        <Modal.Header content="Associate Collections" />
        <Modal.Content scrolling>
          <Menu borderless size="large">
            <Menu.Item onClick={this.toggleFilters}>
              <Icon name="filter" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item>
                {this.renderPagination()}
              </Menu.Item>
            </Menu.Menu>
          </Menu>

          {this.renderFiltersHydrator()}
          {this.renderContent({ usePagination: false })}
        </Modal.Content>
        <Modal.Actions>
          <Button
            content="Cancel"
            onClick={this.handleClose}
          />
          <Button
            color="blue"
            content="Associate content unit to collections"
            onClick={this.handleAssociate}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapState = (state) => {
  const status    = selectors.getNamespaceState(state.lists, NS_UNIT_ASSOCIATION_COLLECTION) || EMPTY_OBJECT;
  const denormIDs = collections.denormIDs(state.collections);
  return {
    ...status,
    items: Array.isArray(status.items) && status.items.length > 0 ? denormIDs(status.items) : EMPTY_ARRAY,
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchList: actions.fetchList,
    setPage: actions.setPage,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(CollectionModal);
