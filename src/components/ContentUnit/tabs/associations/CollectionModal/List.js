import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Icon, Table, Checkbox } from 'semantic-ui-react';

import {
  CONTENT_TYPE_BY_ID,
  CT_DAILY_LESSON,
  CT_HOLIDAY,
  CT_SPECIAL_LESSON,
  EMPTY_ARRAY,
  SECURITY_LEVELS
} from '../../../../../helpers/consts';
import { extractI18n } from '../../../../../helpers/utils';
import * as shapes from '../../../../shapes';

class CollectionsList extends PureComponent {

  static propTypes = {
    items: PropTypes.arrayOf(shapes.Collection),
    getTagByUID: PropTypes.func.isRequired,
    selectedCIds: PropTypes.arrayOf(PropTypes.number),
    selectCollection: PropTypes.func,
    selectAllCollections: PropTypes.func,
    associatedCIds: PropTypes.arrayOf(PropTypes.number),
  };

  static defaultProps = {
    items: EMPTY_ARRAY,
  };

  isAllSelected = () => {
    const { selectedCIds, items, associatedCIds } = this.props;
    return selectedCIds.length >= (items.length - associatedCIds.length) &&
      items.every(u => associatedCIds.includes(u.id) || selectedCIds.includes(u.id));
  };

  renderItem = (item) => {

    const { selectedCIds, getTagByUID, selectCollection, associatedCIds } = this.props;
    let properties                                                        = extractI18n(item.i18n, ['name'])[0];

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
        properties = tag ? extractI18n(tag.i18n, ['label'])[0] : tag;
        if (item.properties.start_date) {
          properties += `  ${item.properties.start_date.substring(0, 4)}`;
        }
        break;
      }
      default:
        properties = item.properties ? item.properties.film_date : '';
      }
    }

    return (
      <Table.Row key={item.id} disabled={associatedCIds.includes(item.id)}>
        <Table.Cell>
          <Checkbox
            type="checkbox"
            onChange={(event, data) => selectCollection(item.id, data.checked)}
            checked={selectedCIds.includes(item.id)}
          />
        </Table.Cell>
        <Table.Cell collapsing>
          <Link to={`/collections/${item.id}`}>
            {item.id}
          </Link>
        </Table.Cell>
        <Table.Cell collapsing>
          {item.uid}
        </Table.Cell>
        <Table.Cell collapsing>
          {CONTENT_TYPE_BY_ID[item.type_id]}
        </Table.Cell>
        <Table.Cell>
          {properties}
        </Table.Cell>
        <Table.Cell collapsing>
          {moment.utc(item.created_at).local().format('YYYY-MM-DD HH:mm:ss')}
        </Table.Cell>
        <Table.Cell collapsing textAlign="center">
          <Icon name="privacy" color={SECURITY_LEVELS[item.secure].color} />
        </Table.Cell>
        <Table.Cell collapsing textAlign="center">
          {
            item.published ?
              <Icon name="checkmark" color="green" /> :
              <Icon name="ban" color="red" />
          }
        </Table.Cell>
      </Table.Row>
    );
  };

  render() {
    const { items } = this.props;

    return (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              <Checkbox
                type="checkbox"
                onChange={(event, data) => this.props.selectAllCollections(data.checked)}
                checked={this.isAllSelected()}
              />
            </Table.HeaderCell>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>UID</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Properties</Table.HeaderCell>
            <Table.HeaderCell>Created At</Table.HeaderCell>
            <Table.HeaderCell>Secure</Table.HeaderCell>
            <Table.HeaderCell>Published</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map(this.renderItem)}
        </Table.Body>
      </Table>
    );
  }
}

export default CollectionsList;
