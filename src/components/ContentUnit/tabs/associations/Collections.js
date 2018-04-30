import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Header, Icon, Menu, Message, Segment, Table, Button } from 'semantic-ui-react';

import { selectors } from '../../../../redux/modules/content_units';
import { actions as collectionActions, selectors as collections } from '../../../../redux/modules/collections';
import { selectors as system } from '../../../../redux/modules/system';
import * as shapes from '../../../shapes';
import { ErrorSplash, LoadingSplash } from '../../../shared/Splash';
import { extractI18n, formatError, titleize } from '../../../../helpers/utils';
import {
  CONTENT_TYPE_BY_ID, EMPTY_ARRAY, EMPTY_OBJECT,
  CT_SPECIAL_LESSON, CT_DAILY_LESSONCT_HOLIDAY, CT_DAILY_LESSON, CT_HOLIDAY
} from '../../../../helpers/consts';

import NewCollections from './CollectionModal/Container';

class Collections extends Component {

  static propTypes = {
    ccus: PropTypes.arrayOf(shapes.CollectionContentUnit),
    wip: PropTypes.bool,
    err: shapes.Error,
    currentLanguage: PropTypes.string.isRequired,
  };

  static defaultProps = {
    ccus: EMPTY_ARRAY,
    wip: false,
    err: null,
  };

  state = {
    isShowAssociateModal: false
  };

  handleShowAssociateModal = () => {
    this.setState({ isShowAssociateModal: !this.state.isShowAssociateModal });
  };

  handleUnAssociate = (collection) => {
    this.props.deleteItemUnit(collection.id, this.props.unit.id);
  };

  getProperties = (item) => {
    const { getTagByUID, currentLanguage } = this.props;

    let properties = extractI18n(item.i18n, ['name'], currentLanguage)[0];

    if (!properties) {
      switch (CONTENT_TYPE_BY_ID[item.type_id]) {
      case CT_SPECIAL_LESSON:
      case CT_DAILY_LESSON: {
        const { film_date: filmDate, number } = item.properties;
        properties                            = filmDate;
        if (number) {
          properties += `, number ${number}`;
        }
        break;
      }
      case CT_HOLIDAY: {
        const tag  = getTagByUID(item.properties.holiday_tag);
        properties = tag ? extractI18n(tag.i18n, ['label'], currentLanguage)[0] : tag;
        if (item.properties.start_date) {
          properties += `  ${item.properties.start_date.substring(0, 4)}`;
        }
        break;
      }
      default:
        properties = item.properties ? item.properties.film_date : '';
      }
    }
    return properties;
  };

  renderRow = (item) => {
    const { id, uid, type_id, created_at } = item;

    const type = CONTENT_TYPE_BY_ID[type_id];

    return (
      <Table.Row key={id}>
        <Table.Cell><Link to={`/collections/${id}`}>{uid}</Link></Table.Cell>
        <Table.Cell>{titleize(type)}</Table.Cell>
        <Table.Cell>{this.getProperties(item)}</Table.Cell>
        <Table.Cell>{moment.utc(created_at).local().format('YYYY-MM-DD HH:mm:ss')}</Table.Cell>
        <Table.Cell width="1">
          <Button
            circular
            compact
            size="mini"
            icon="remove"
            color="red"
            inverted
            onClick={() => this.handleUnAssociate(item)}
          /></Table.Cell>
      </Table.Row>
    );
  };

  renderTable = (items) => {
    return (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>UID</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Properties</Table.HeaderCell>
            <Table.HeaderCell>Created At</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map(c => this.renderRow(c.collection))}
        </Table.Body>
      </Table>
    );
  };

  render() {
    const { ccus, wip, err } = this.props;

    let content;
    if (err) {
      content = <ErrorSplash text="Server Error" subtext={formatError(err)} />;
    } else if (ccus.length === 0) {
      content = wip ?
        <LoadingSplash text="Loading collections" /> :
        <Message>No collections found for this unit</Message>;
    } else {
      content = this.renderTable(ccus);
    }

    return (
      <div>
        <Menu attached borderless size="large">
          <Menu.Item header>
            <Header content="Collections" size="medium" color="blue" />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item onClick={this.handleShowAssociateModal}>
              <Icon name="plus" /> Add Collections
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <Segment attached>
          {content}
          <NewCollections
            {...this.props}
            handleShowAssociateModal={this.handleShowAssociateModal}
            isShowAssociateModal={this.state.isShowAssociateModal} />
        </Segment>
      </div>
    );
  }
}

const mapState = (state, ownProps) => {
  const { unit = EMPTY_OBJECT } = ownProps;
  const collectionIDs           = unit.collections;
  const denormCCUs              = collections.denormCCUs(state.collections);
  return {
    associatedCIds: collectionIDs ? collectionIDs.map(c => c.collection_id) : [],
    ccus: collectionIDs ? denormCCUs(collectionIDs) : EMPTY_ARRAY,
    wip: selectors.getWIP(state.content_units, 'fetchItemCollections'),
    err: selectors.getError(state.content_units, 'fetchItemCollections'),
    wipAssociate: collections.getWIP(state.collections, 'associateUnit'),
    errAssociate: collections.getError(state.collections, 'associateUnit'),
    currentLanguage: system.getCurrentLanguage(state.system),
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    associate: collectionActions.associateUnit,
    deleteItemUnit: collectionActions.deleteItemUnit,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(Collections);
