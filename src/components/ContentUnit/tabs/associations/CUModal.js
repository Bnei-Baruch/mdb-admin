import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Icon, Menu, Modal } from 'semantic-ui-react';

import { CONTENT_UNIT_TYPES, EMPTY_ARRAY, EMPTY_OBJECT, NS_UNIT_ASSOCIATION_CU } from '../../../../helpers/consts';
import { selectors as units } from '../../../../redux/modules/collections';
import { actions, selectors } from '../../../../redux/modules/lists';
import CUList from '../../../BaseClasses/CUList';
import ListWithCheckboxBase from '../../../BaseClasses/ListWithCheckboxBase';
import * as shapes from '../../../shapes';

class CUModal extends ListWithCheckboxBase {
  static propTypes = {
    ...ListWithCheckboxBase.propTypes,
    unit: shapes.ContentUnit,
  };

  componentDidMount() {
    this.askForData(1);
  }

  componentDidUpdate(prevProps) {
    if (this.props.wipAssociate && !prevProps.wipAssociate) {
      this.props.handleToggleModal();
    }
  }

  getNamespace = () => NS_UNIT_ASSOCIATION_CU;

  getContentType = () => CONTENT_UNIT_TYPES;

  renderList = () => {
    const { items, currentLanguage, associatedIds } = this.props;

    return (
      <CUList
        {...this.getSelectListProps()}
        items={items}
        associatedIds={associatedIds}
        currentLanguage={currentLanguage}
      />
    );
  };

  askForData = pageNo =>
    this.props.fetchList(NS_UNIT_ASSOCIATION_CU, pageNo);

  handleAssociate = () => {
    const { associate, unit } = this.props;
    this.state.selectedIds.forEach(cId => associate(unit.id, cId));
    this.handleClose();
  };

  handleClose = () => {
    this.setState({ selectedIds: [], showFilters: false });
    this.props.handleToggleModal();
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
        <Modal.Header content="Associate Content Units" />
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
          <Button content="Cancel" onClick={this.handleClose} />
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
  const status    = selectors.getNamespaceState(state.lists, NS_UNIT_ASSOCIATION_CU) || EMPTY_OBJECT;
  const denormIDs = units.denormIDs(state.content_units);
  return {
    ...status,
    wip: units.getWIP(state.content_units, 'fetchList'),
    err: units.getError(state.content_units, 'fetchList'),
    items: Array.isArray(status.items) && status.items.length > 0 ? denormIDs(status.items) : EMPTY_ARRAY,
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchList: actions.fetchList,
    setPage: actions.setPage,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(CUModal);
