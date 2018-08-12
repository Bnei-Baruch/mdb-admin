import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Header, Icon, Menu, Message, Segment, Table, Button
} from 'semantic-ui-react';

import { CONTENT_TYPE_BY_ID, EMPTY_ARRAY } from '../../../../helpers/consts';
import { extractI18n, formatError, titleize } from '../../../../helpers/utils';
import * as shapes from '../../../shapes';
import EditedField from '../../../shared/Fields/EditedField';
import { ErrorSplash, LoadingSplash } from '../../../shared/Splash';
import CUModal from './CUModal';

export default class HierarchyUnitsView extends Component {
  static propTypes = {
    unit: shapes.ContentUnit.isRequired,
    cuds: PropTypes.arrayOf(shapes.ContentUnitDerivation),
    wip: PropTypes.bool,
    err: shapes.Error,
    currentLanguage: PropTypes.string.isRequired,
    removeAssociate: PropTypes.func.isRequired,
    updateAssociation: PropTypes.func.isRequired,
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
    const { unit, removeAssociate } = this.props;
    removeAssociate(unit.id, id);
  };

  handleUpdateAssociation = (cuId, name) => {
    const { unit, updateAssociation } = this.props;
    updateAssociation(unit.id, cuId, { name });
  };

  renderRow = (item) => {
    const {
      id, uid, i18n, type_id, properties
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
          <Button
            circular
            compact
            inverted
            size="mini"
            icon="remove"
            color="red"
            onClick={() => this.handleUnAssociate(id)}
          />
        </Table.Cell>
      </Table.Row>
    );
  };

  renderTable = () => {
    const {
      cuds, wip, err, blockName
    } = this.props;

    if (err) {
      return <ErrorSplash text="Server Error" subtext={formatError(err)} />;
    }

    if (cuds.length === 0) {
      return wip
        ? <LoadingSplash text={`Loading ${blockName}`} />
        : <Message>{`No ${blockName} found for this unit`}</Message>;
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
    const {
      associate, associatedIds, currentLanguage, unit, blockName
    } = this.props;

    return (
      <div>
        <Menu attached borderless size="large">
          <Menu.Item header>
            <Header content={blockName} size="medium" color="blue" />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item onClick={this.handleToggleModal}>
              <Icon name="plus" />{`Add ${blockName}`}
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <Segment attached>
          {this.renderTable()}
          <CUModal
            unit={unit}
            isShowAssociateModal={this.state.isShowAssociateModal}
            handleToggleModal={this.handleToggleModal}
            associate={associate}
            associatedIds={associatedIds}
            currentLanguage={currentLanguage}
          />
        </Segment>
      </div>
    );
  }
}
