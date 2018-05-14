import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Header, Icon, Menu, Message, Segment, Table, Button } from 'semantic-ui-react';

import { selectors, actions } from '../../../../redux/modules/content_units';
import { selectors as system } from '../../../../redux/modules/system';

import * as shapes from '../../../shapes';
import EditedField from '../../../shared/Fields/EditedField';
import { ErrorSplash, LoadingSplash } from '../../../shared/Splash';
import { extractI18n, formatError, titleize } from '../../../../helpers/utils';
import { CONTENT_TYPE_BY_ID, EMPTY_ARRAY, EMPTY_OBJECT, SECURITY_LEVELS } from '../../../../helpers/consts';

import NewUnits from './CUModal/Container';

class Origins extends Component {

  static propTypes = {
    cuds: PropTypes.arrayOf(shapes.ContentUnitDerivation),
    wip: PropTypes.bool,
    err: shapes.Error,
  };

  static defaultProps = {
    cuds: EMPTY_ARRAY,
    wip: false,
    err: null,
  };

  state = {
    isShowAssociateModal: false,
  };

  handleToggleModal = () => {
    this.setState({ isShowAssociateModal: !this.state.isShowAssociateModal });
  };

  handleUnAssociate = (id) => {
    this.props.removeAssociate(this.props.unit.id, id);
  };

  handleUpdateAssociation = (cuId, name) => {
    this.props.updateAssociation(this.props.unit.id, cuId, { name });
  };

  renderRow = (item) => {
    const {
            id,
            uid,
            i18n,
            type_id,
            properties,
          } = item.content_unit;

    const { film_date: filmDate } = properties || {};
    return (
      <Table.Row key={id}>
        <Table.Cell><Link to={`/content_units/${id}`}>{uid}</Link></Table.Cell>
        <Table.Cell>{extractI18n(i18n, ['name'], this.props.currentLanguage)[0] || uid}</Table.Cell>
        <Table.Cell>{titleize(CONTENT_TYPE_BY_ID[type_id])}</Table.Cell>
        <Table.Cell>{filmDate}</Table.Cell>
        <Table.Cell collapsing>
          <EditedField
            value={item.name}
            onSave={val => this.handleUpdateAssociation(id, val)}
          />
        </Table.Cell>
        <Table.Cell width="1">
          <Button circular compact size="mini" icon="remove" color="red" inverted onClick={() => this.handleUnAssociate(id)} /></Table.Cell>
      </Table.Row>
    );
  };

  renderTable = () => {
    const { cuds, wip, err } = this.props;
    if (err) {
      return <ErrorSplash text="Server Error" subtext={formatError(err)} />;
    } else if (cuds.length === 0) {
      return ( wip ?
        <LoadingSplash text="Loading origins" /> :
        <Message>No origins found for this unit</Message>);
    }
    return (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>UID</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Film Date</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>&nbsp;</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {cuds.map(this.renderRow)}
        </Table.Body>
      </Table>
    );
  };

  render() {
    const { associate, associatedIds, currentLanguage, unit } = this.props;

    return (
      <div>
        <Menu attached borderless size="large">
          <Menu.Item header>
            <Header content="Origins" size="medium" color="blue" />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item onClick={this.handleToggleModal}>
              <Icon name="plus" /> Add Origins
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <Segment attached>
          {this.renderTable()}
          <NewUnits
            unit={unit}
            isShowAssociateModal={this.state.isShowAssociateModal}
            handleToggleModal={this.handleToggleModal}
            associate={associate}
            associatedIds={associatedIds}
            currentLanguage={currentLanguage}>
          </NewUnits>
        </Segment>
      </div>
    );
  }
}

const mapState = (state, ownProps) => {
  const { unit = EMPTY_OBJECT }            = ownProps;
  const { origins = [], derivatives = [] } = unit;
  const denormCUDs                         = selectors.denormCUDs(state.content_units);

  return {
    cuds: origins.length > 0 ? denormCUDs(origins) : EMPTY_ARRAY,
    wip: selectors.getWIP(state.content_units, 'fetchItemOrigins'),
    err: selectors.getError(state.content_units, 'fetchItemOrigins'),
    currentLanguage: system.getCurrentLanguage(state.system),
    associatedIds: [...origins, ...derivatives].map(cu => cu.content_unit_id),
    wipAssociate: selectors.getWIP(state.content_units, 'addItemDerivatives'),
    errAssociate: selectors.getError(state.content_units, 'addItemDerivatives'),
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    associate: (id, childId) => actions.addItemDerivatives(childId, id),
    removeAssociate: (id, childId) => actions.removeItemDerivatives(childId, id),
    updateAssociation: (id, childId, params) => actions.updateItemDerivatives(childId, id, params),
  }, dispatch);
}

export default connect(mapState, mapDispatch)(Origins);
