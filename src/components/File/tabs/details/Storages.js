import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Flag, Header, Menu, Message, Segment, Table
} from 'semantic-ui-react';

import { EMPTY_ARRAY } from '../../../../helpers/consts';
import { selectors as storagesSelectors } from '../../../../redux/modules/storages';
import * as shapes from '../../../shapes';

const Storages = (props) => {
  const { items } = props;

  items.sort((a, b) => {
    if (a.country === b.country) {
      if (a.location === b.location) {
        if (a.status === b.status) {
          if (a.access === b.access) {
            if (a.name === b.name) {
              return 0;
            }
            return (a.name < b.name) ? -1 : 1;
          }
          return (a.access < b.access) ? -1 : 1;
        }
        return (a.status < b.status) ? -1 : 1;
      }
      return (a.location < b.location) ? -1 : 1;
    }
    return (a.country < b.country) ? -1 : 1;
  });

  const rows = items.map((x) => {
    const {
      country, location, access, status, name, id
    } = x;

    return (
      <Table.Row key={id}>
        <Table.Cell><Flag name={country} /></Table.Cell>
        <Table.Cell>{location}</Table.Cell>
        <Table.Cell>{status}</Table.Cell>
        <Table.Cell>{access}</Table.Cell>
        <Table.Cell>{name}</Table.Cell>
      </Table.Row>
    );
  });

  const content = rows.length > 0
    ? (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Country</Table.HeaderCell>
            <Table.HeaderCell>Location</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Access</Table.HeaderCell>
            <Table.HeaderCell>Device</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows}
        </Table.Body>
      </Table>
    )
    : <Message>Does not exist physically</Message>;
  return (
    <div>
      <Menu attached borderless size="large">
        <Menu.Item header>
          <Header content="Storage locations" size="medium" color="blue" />
        </Menu.Item>
      </Menu>
      <Segment attached>
        {content}
      </Segment>
    </div>
  );
};

Storages.propTypes = {
  file: shapes.File,  // eslint-disable-line react/no-unused-prop-types
  items: PropTypes.arrayOf(shapes.Storage),
};

Storages.defaultProps = {
  file: null,
  items: EMPTY_ARRAY,
};

const mapState = (state, props) => ({
  items: props.file ? storagesSelectors.denormIDs(state.storages)(props.file.storages || []) : EMPTY_ARRAY,
});

export default connect(mapState)(Storages);
