import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Icon, Table } from 'semantic-ui-react';

import {
  CONTENT_TYPE_BY_ID,
  CT_DAILY_LESSON,
  CT_HOLIDAY,
  CT_SPECIAL_LESSON,
  EMPTY_ARRAY,
  SECURITY_LEVELS
} from '../../helpers/consts';
import { extractI18n } from '../../helpers/utils';
import * as shapes from '../shapes';

class CollectionsList extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(shapes.Collection),
    getTagByUID: PropTypes.func.isRequired,
    currentLanguage: PropTypes.string.isRequired,
  };

  static defaultProps = {
    items: EMPTY_ARRAY,
  };

  renderItem = (item) => {
    const { currentLanguage } = this.props;
    let properties            = extractI18n(item.i18n, ['name'], currentLanguage)[0];

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
        const tag  = this.props.getTagByUID(item.properties.holiday_tag);
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

    return (
      <Table.Row key={item.id}>
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
          {moment.utc(item.created_at).format('YYYY-MM-DD HH:mm:ss')}
        </Table.Cell>
        <Table.Cell collapsing textAlign="center">
          <Icon name="privacy" color={SECURITY_LEVELS[item.secure].color} />
        </Table.Cell>
        <Table.Cell collapsing textAlign="center">
          {
            item.published
              ? <Icon name="checkmark" color="green" />
              : <Icon name="ban" color="red" />
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
          {items.filter(x => x).map(this.renderItem)}
        </Table.Body>
      </Table>
    );
  }
}

export default CollectionsList;
