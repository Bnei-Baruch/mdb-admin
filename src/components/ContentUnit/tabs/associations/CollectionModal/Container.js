import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon, Menu, Button, Modal } from 'semantic-ui-react';
import uniq from 'lodash/uniq';

import {
  EMPTY_ARRAY,
  EMPTY_OBJECT,
  NS_UNIT_ASSOCIATION_COLLECTION,
  COLLECTION_TYPES
} from '../../../../../helpers/consts';
import { actions, selectors } from '../../../../../redux/modules/lists';
import { selectors as collections } from '../../../../../redux/modules/collections';
import { selectors as tagSelectors } from '../../../../../redux/modules/tags';

import * as shapes from '../../../../shapes';
import ListWithFiltersBase from '../../../../BaseClasses/ListWithFiltersBase';
import CollectionsList from './List';

class NewCollections extends ListWithFiltersBase {

  constructor(props) {
    super(props);
    NewCollections.propTypes = {
      ...super.propTypes,
      unit: shapes.ContentUnit,
      items: PropTypes.arrayOf(shapes.Collection),
      getTagByUID: PropTypes.func.isRequired,
      associatedCIds: PropTypes.arrayOf(PropTypes.number),
    };

    this.state = {
      ...super.state,
      selectedCIds: []
    };
  }

  componentDidMount() {
    this.askForData(1);
  }

  componentWillReceiveProps(nextProps) {
    const { wipAssociate } = this.props;
    if (nextProps.unit && wipAssociate && !nextProps.wipAssociate) {
      this.askForData(1);
      this.handleClose();
    }
  }

  getNamespace = () => NS_UNIT_ASSOCIATION_COLLECTION;

  getContentType = () => COLLECTION_TYPES;

  renderList = () => {
    const { getTagByUID, associatedCIds, currentLanguage, items } = this.props;
    return <CollectionsList
      items={items}
      getTagByUID={getTagByUID}
      selectedCIds={this.state.selectedCIds}
      associatedCIds={associatedCIds}
      selectCollection={this.selectCollection}
      selectAllCollections={this.selectAllCollections}
      currentLanguage={currentLanguage} />;
  };

  askForData = (pageNo) => this.props.fetchList(NS_UNIT_ASSOCIATION_COLLECTION, pageNo);

  handleAssociate = () => {
    const { associate, unit } = this.props;
    this.state.selectedCIds.forEach(cId => associate(cId, [{
      content_unit_id: unit.id,
      name: '',
      position: 0
    }]));
  };

  handleClose = () => {
    this.setState({ selectedCIds: [], showFilters: false });
    this.props.handleShowAssociateModal();
  };

  selectCollection = (id, checked) => {
    const selectedCIds = this.state.selectedCIds;
    if (checked) {
      selectedCIds.push(id);
    } else {
      selectedCIds.splice(selectedCIds.findIndex(x => id === x), 1);
    }
    this.setState({ selectedCIds: [...selectedCIds] });
  };

  selectAllCollections = (checked) => {
    const { items, associatedCIds } = this.props;
    const { selectedCIds }          = this.state;
    if (checked) {
      this.setState({ selectedCIds: uniq([...selectedCIds, ...items.filter(c => !associatedCIds.includes(c.id)).map(x => x.id)]) });
    } else {
      this.setState({ selectedCIds: selectedCIds.filter(id => !items.some(y => id === y.id)) });
    }
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
        size="fullscreen"
        open={isShowAssociateModal}
        onClose={this.handleClose}>
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
          <Button content="Cancel"
                  onClick={this.handleClose} />
          <Button
            onClick={this.handleAssociate}
            content="Associate content unit to collections"
            color="blue" />
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
    wip: collections.getWIP(state.collections, 'fetchList'),
    err: collections.getError(state.collections, 'fetchList'),
    items: Array.isArray(status.items) && status.items.length > 0 ?
      denormIDs(status.items) :
      EMPTY_ARRAY,
    getTagByUID: tagSelectors.getTagByUID(state.tags),
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchList: actions.fetchList,
    setPage: actions.setPage,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(NewCollections);
