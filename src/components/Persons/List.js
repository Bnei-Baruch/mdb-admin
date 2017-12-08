import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table } from 'semantic-ui-react';

import { EMPTY_ARRAY } from '../../helpers/consts';
import { extractI18n } from '../../helpers/utils';
import * as shapes from '../shapes';

class PersonsList extends PureComponent {

  static propTypes = {
    items: PropTypes.arrayOf(shapes.Person),
  };

  static defaultProps = {
    items: EMPTY_ARRAY,
  };

  renderItem = (item) => {

    return (
      <Table.Row key={item.id}>
        <Table.Cell collapsing>
          <Link to={`/Persons/${item.id}`}>
            {item.id}
          </Link>
        </Table.Cell>
        <Table.Cell collapsing>
          {item.uid}
        </Table.Cell>
        <Table.Cell collapsing>
          {item.pattern}
        </Table.Cell>
        <Table.Cell>
          {extractI18n(item.i18n, ['name'])[0]}
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
            <Table.HeaderCell>Pattern</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
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

export default PersonsList;