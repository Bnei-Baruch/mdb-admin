import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Icon, Menu, Button, Modal } from 'semantic-ui-react';
import uniq from 'lodash/uniq';

import { EMPTY_ARRAY, EMPTY_OBJECT, NS_UNIT_ASSOCIATION_CU, CONTENT_UNIT_TYPES } from '../../../../../helpers/consts';
import { actions, selectors } from '../../../../../redux/modules/lists';
import { selectors as units } from '../../../../../redux/modules/collections';

import ListWithFiltersBase from '../../../../BaseClasses/ListWithFiltersBase';

import * as shapes from '../../../../shapes';
import CollectionsList from './List';

class NewUnits extends ListWithFiltersBase {

  constructor(props) {
    super(props);
    NewUnits.propTypes = {
      ...super.propTypes,
      unit: shapes.ContentUnit,
      items: PropTypes.arrayOf(shapes.ContentUnit),
      associatedIds: PropTypes.arrayOf(PropTypes.number),
    };

    NewUnits.defaultProps = {
      ...super.defaultProps,
      associatedIds: []
    };

    this.state = {
      ...super.state,
      selectedIds: []
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

  getNamespace = () => NS_UNIT_ASSOCIATION_CU;

  getContentType = () => CONTENT_UNIT_TYPES;

  renderList = () => {
    const { items, currentLanguage, associatedIds } = this.props;
    return (<CollectionsList
      items={items}
      selectedIds={this.state.selectedIds}
      associatedIds={associatedIds}
      selectCU={this.selectCU}
      selectAllCUs={this.selectAllCUs}
      currentLanguage={currentLanguage} />);
  };

  askForData = (pageNo) => this.props.fetchList(NS_UNIT_ASSOCIATION_CU, pageNo);

  handleAssociate = () => {
    const { associate, unit } = this.props;
    this.state.selectedIds.forEach(cId => associate(unit.id, cId));
    this.handleClose();

  };

  handleClose = () => {
    this.setState({ selectedIds: [], showFilters: false });
    this.props.handleToggleModal();
  };

  selectCU = (id, checked) => {
    const selectedIds = this.state.selectedIds;
    if (checked) {
      selectedIds.push(id);
    } else {
      selectedIds.splice(selectedIds.findIndex(x => id === x), 1);
    }
    this.setState({ selectedIds: [...selectedIds] });
  };

  selectAllCUs = (checked) => {
    const { items, associatedIds } = this.props;
    const { selectedIds }          = this.state;
    if (checked) {
      this.setState({ selectedIds: uniq([...selectedIds, ...items.filter(c => !associatedIds.includes(c.id)).map(x => x.id)]) });
    } else {
      this.setState({ selectedIds: selectedIds.filter(id => !items.some(y => id === y.id)) });
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
            onClick={this.handleAssociate}
            content="Associate content unit to collections"
            color="blue" />
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

export default connect(mapState, mapDispatch)(NewUnits);
