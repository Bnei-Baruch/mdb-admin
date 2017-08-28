import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Table } from 'semantic-ui-react';

import { EMPTY_ARRAY, OPERATION_TYPE_BY_ID } from '../../helpers/consts';
import * as shapes from '../shapes';

class FilesList extends PureComponent {

  static propTypes = {
    items: PropTypes.arrayOf(shapes.Operation),
  };

  static defaultProps = {
    items: EMPTY_ARRAY,
  };

  renderItem = (item) => {
    let type = OPERATION_TYPE_BY_ID[item.type_id];
    if (item.properties) {
      if (item.properties.capture_source) {
        type += ` - ${item.properties.capture_source}`;
      }
      if (item.properties.final_name) {
        type += ` - ${item.properties.final_name}`;
      }
      if (item.properties.insert_type) {
        type += ` - ${item.properties.insert_type}`;
      }
      if (item.properties.workflow_id) {
        type += ` [${item.properties.workflow_id}]`;
      }
    }

    return (
      <Table.Row key={item.id}>
        <Table.Cell collapsing>
          <Link to={`/operations/${item.id}`}>
            {item.id}
          </Link>
        </Table.Cell>
        <Table.Cell collapsing>
          {item.uid}
        </Table.Cell>
        <Table.Cell>
          {type}
        </Table.Cell>
        <Table.Cell collapsing>
          {item.station}
        </Table.Cell>
        <Table.Cell collapsing>
          {moment.utc(item.created_at).local().format('YYYY-MM-DD HH:mm:ss')}
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
            <Table.HeaderCell>Station</Table.HeaderCell>
            <Table.HeaderCell>Created At</Table.HeaderCell>
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
