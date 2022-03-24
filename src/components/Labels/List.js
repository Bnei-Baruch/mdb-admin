import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table } from 'semantic-ui-react';

import { EMPTY_ARRAY } from '../../helpers/consts';
import { extractI18n } from '../../helpers/utils';
import * as shapes from '../shapes';

class PublishersList extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(shapes.Publisher),
    currentLanguage: PropTypes.string.isRequired,
  };

  static defaultProps = {
    items: EMPTY_ARRAY,
  };

  renderItem = item => {
    const { id, uid, i18n } = item;
    const i18nFields        = extractI18n(i18n, ['name', 'author'], this.props.currentLanguage);
    return (
      <Table.Row key={id}>
        <Table.Cell collapsing>
          <Link to={`/labels/${id}`}>
            {id}
          </Link>
        </Table.Cell>
        <Table.Cell collapsing>
          {uid}
        </Table.Cell>
        <Table.Cell>
          {i18nFields[0]}
        </Table.Cell>
        <Table.Cell>
          {i18nFields[1]?.name}
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
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Author</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.filter(x => x).map(this.renderItem)}
        </Table.Body>
      </Table>
    );
  }
}

export default PublishersList;
