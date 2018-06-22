import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Checkbox, Icon, Table } from 'semantic-ui-react';
import filesize from 'filesize';

import { SECURITY_LEVELS } from '../../helpers/consts';
import ListBase from './ListBase';
import * as shapes from '../shapes';

class FilesList extends ListBase {

  static propTypes = {
    ...ListBase.propTypes,
    items: PropTypes.arrayOf(shapes.File),
  };

  renderItem = (item) => {
    const { selectedIds, associatedIds, withCheckBox } = this.props;
    console.log('FilesList', withCheckBox);
    return (
      <Table.Row key={item.id} disabled={!item || associatedIds.includes(item.id)}>
        {withCheckBox ? (
          <Table.Cell>
            <Checkbox
              type="checkbox"
              onChange={(event, data) => this.selectHandler(item, data.checked)}
              checked={selectedIds.includes(item.id)}
            />
          </Table.Cell>
        ) : null}
        <Table.Cell collapsing>
          <Link to={`/files/${item.id}`}>
            {item.id}
          </Link>
        </Table.Cell>
        <Table.Cell collapsing>
          {item.uid}
        </Table.Cell>
        <Table.Cell style={item.removed_at ? { textDecoration: 'line-through' } : null}>
          {item.name}
        </Table.Cell>
        <Table.Cell collapsing>
          {filesize(item.size)}
        </Table.Cell>
        <Table.Cell collapsing>
          {moment.utc(item.created_at).format('YYYY-MM-DD HH:mm:ss')}
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
    const { items, withCheckBox } = this.props;
    return (
      <div>
        <Table>
          <Table.Header>
            <Table.Row>
              {withCheckBox ? (
                <Table.HeaderCell width="1">
                  <Checkbox
                    type="checkbox"
                    onChange={this.selectAllHandler}
                    checked={this.isAllSelected()}
                  />
                </Table.HeaderCell>
              ) : null}
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>UID</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Size</Table.HeaderCell>
              <Table.HeaderCell>Created At</Table.HeaderCell>
              <Table.HeaderCell>Secure</Table.HeaderCell>
              <Table.HeaderCell>Published</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {items.filter(x => x).map(this.renderItem)}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default FilesList;
