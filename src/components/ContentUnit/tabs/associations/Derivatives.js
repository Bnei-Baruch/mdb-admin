/**
 * @TODO
 * use base class common with ./Origins.js
 */

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

class Derivatives extends Component {

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
            secure,
            published,
            properties,
          } = item.content_unit;

    const { duration, film_date: filmDate } = properties || {};
    return (
      <Table.Row key={id}>
        <Table.Cell><Link to={`/content_units/${id}`}>{extractI18n(i18n, ['name'], this.props.currentLanguage)[0] || uid}</Link></Table.Cell>
        <Table.Cell>{titleize(CONTENT_TYPE_BY_ID[type_id])}</Table.Cell>
        <Table.Cell>{filmDate}</Table.Cell>
        <Table.Cell>{duration ? moment.utc(moment.duration(duration, 's').asMilliseconds()).format('HH:mm:ss') : null}</Table.Cell>
        <Table.Cell>
          <Header size="tiny" content={SECURITY_LEVELS[secure].text} color={SECURITY_LEVELS[secure].color} /></Table.Cell>
        <Table.Cell>{published ? <Icon name="checkmark" color="green" /> :
          <Icon name="ban" color="red" />}</Table.Cell>
        <Table.Cell>
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
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Film Date</Table.HeaderCell>
            <Table.HeaderCell>Duration</Table.HeaderCell>
            <Table.HeaderCell>Security</Table.HeaderCell>
            <Table.HeaderCell>Published</Table.HeaderCell>
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
            <Header content="Derivatives" size="medium" color="blue" />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item onClick={this.handleToggleModal}>
              <Icon name="plus" /> Add Derivatives
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
    cuds: derivatives.length > 0 ? denormCUDs(derivatives) : EMPTY_ARRAY,
    wip: selectors.getWIP(state.content_units, 'fetchItemDerivatives'),
    err: selectors.getError(state.content_units, 'fetchItemDerivatives'),
    currentLanguage: system.getCurrentLanguage(state.system),
    associatedIds: [...origins, ...derivatives].map(cu => cu.content_unit_id),
    wipAssociate: selectors.getWIP(state.content_units, 'addItemDerivatives'),
    errAssociate: selectors.getError(state.content_units, 'addItemDerivatives'),
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    associate: actions.addItemDerivatives,
    removeAssociate: actions.removeItemDerivatives,
    updateAssociation: actions.updateItemDerivatives,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(Derivatives);
