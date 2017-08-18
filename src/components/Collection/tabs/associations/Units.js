import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Icon, Table, Header, List, Menu, Message, Segment } from 'semantic-ui-react';

import {
  CONTENT_TYPE_BY_ID,
  CT_DAILY_LESSON,
  CT_SPECIAL_LESSON,
  SECURITY_LEVELS
} from '../../../../helpers/consts';
import { ErrorSplash, LoadingSplash } from '../../../shared/Splash';
import { extractI18n, formatError, titleize } from '../../../../helpers/utils';
import * as shapes from '../../../shapes';
import EditDeleteField from '../../../shared/Fields/EditDeleteField';

class Units extends PureComponent {

  static propTypes = {
    units: PropTypes.arrayOf(shapes.CollectionContentUnit),
    updateItemUnitProperties: PropTypes.func,
    collection: shapes.Collection,
    wip: PropTypes.bool,
    err: shapes.Error,
  };

  saveAssociationNum = (id, cuId, val) => {
    this.props.updateItemUnitProperties(id, cuId, { name: val });
  };

  renderItem = (item) => {
    const collection = this.props.collection;
    const unit = item.content_unit;
    let properties = extractI18n(unit.i18n, ['name'])[0];

    if (!properties) {
      switch (CONTENT_TYPE_BY_ID[unit.type_id]) {
      case CT_SPECIAL_LESSON:
      case CT_DAILY_LESSON: {
        const { film_date: filmDate, number } = unit.properties;
        properties = filmDate;
        if (number) {
          properties += `, number ${number}`;
        }
        break;
      }
      default:
        properties = unit.properties ? unit.properties.film_date : '';
      }
    }

    return (
      <Table.Row key={unit.id}>
        <Table.Cell collapsing>
          <Link to={`/content_units/${unit.id}`}>
            {unit.id}
          </Link>
        </Table.Cell>
        <Table.Cell collapsing>
          {unit.uid}
        </Table.Cell>
        <Table.Cell collapsing>
          {CONTENT_TYPE_BY_ID[unit.type_id]}
        </Table.Cell>
        <Table.Cell>
          {properties}
        </Table.Cell>
        <Table.Cell collapsing>
          {moment.utc(unit.created_at).local().format('YYYY-MM-DD HH:mm:ss')}
        </Table.Cell>
        <Table.Cell collapsing textAlign="center">
          <Icon name="privacy" color={SECURITY_LEVELS[unit.secure].color} />
        </Table.Cell>
        <Table.Cell collapsing textAlign="center">
          {
            unit.published ?
              <Icon name="checkmark" color="green" /> :
              <Icon name="ban" color="red" />
          }
        </Table.Cell>
        <Table.Cell>
          <EditDeleteField
            value={item.name}
            save={(val) => this.saveAssociationNum(collection.id, unit.id, val)}
            remove={(val) => alert('remove')} />
        </Table.Cell>
      </Table.Row>
    );
  };

  render() {
    const { units, wip, err } = this.props;
    let content = '';
    if (err) {
      content = <ErrorSplash text="Server Error" subtext={formatError(err)} />;
    } else if (units.length === 0) {
      content = wip ?
        <LoadingSplash text="Loading content units" /> :
        <Message>No content units found for this collection</Message>;
    } else {
      content = (<Table columns={8}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>UID</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Properties</Table.HeaderCell>
            <Table.HeaderCell>Created At</Table.HeaderCell>
            <Table.HeaderCell>Secure</Table.HeaderCell>
            <Table.HeaderCell>Published</Table.HeaderCell>
            <Table.HeaderCell>Association No.</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            units.map(x => this.renderItem(x))
          }
        </Table.Body>
      </Table>);
    }
    return (content);
  }
}

export default Units;