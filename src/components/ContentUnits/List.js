import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Icon, Table } from 'semantic-ui-react';

import { CONTENT_TYPE_BY_ID, EMPTY_ARRAY, SECURITY_LEVELS } from '../../helpers/consts';
import { extractI18n } from '../../helpers/utils';
import * as shapes from '../shapes';

class FilesList extends PureComponent {

  static propTypes = {
    items: PropTypes.arrayOf(shapes.ContentUnit),
    currentLanguage: PropTypes.string.isRequired,
  };

  static defaultProps = {
    items: EMPTY_ARRAY,
  };

  renderItem = item => {
    const { currentLanguage } = this.props;

    return (
      <Table.Row key={item.id}>
        <Table.Cell collapsing>
          <Link to={`/content_units/${item.id}`}>
            {item.id}
          </Link>
        </Table.Cell>
        <Table.Cell collapsing>
          {item.uid}
        </Table.Cell>
        <Table.Cell collapsing>
          {CONTENT_TYPE_BY_ID[item.type_id]}
        </Table.Cell>
        <Table.Cell className="rtl-dir" textAlign="right">
          {extractI18n(item.i18n, ['name'], currentLanguage)[0]}
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
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>UID</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Created At</Table.HeaderCell>
            <Table.HeaderCell>Secure</Table.HeaderCell>
            <Table.HeaderCell>Published</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            items.map(x => this.renderItem(x))
          }
        </Table.Body>
      </Table>
    );
  }
}

export default FilesList;
