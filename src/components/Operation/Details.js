import React from 'react';
import moment from 'moment';
import {
  Header, List, Menu, Segment
} from 'semantic-ui-react';

import { OPERATION_TYPE_BY_ID } from '../../helpers/consts';
import * as shapes from '../shapes';

const Details = (props) => {
  const { operation } = props;
  if (!operation) {
    return null;
  }

  return (
    <div>
      <Menu attached borderless size="large">
        <Menu.Item header>
          <Header content="Details" color="blue" />
        </Menu.Item>
      </Menu>

      <Segment attached>
        <List divided relaxed>
          <List.Item>
            <strong>ID</strong>
            <List.Content floated="right">
              {operation.id}
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>UID</strong>
            <List.Content floated="right">
              {operation.uid}
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>DB created_at</strong>
            <List.Content floated="right">
              {moment.utc(operation.created_at).format('YYYY-MM-DD HH:mm:ss')}
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>Type</strong>
            <List.Content floated="right">
              {OPERATION_TYPE_BY_ID[operation.type_id]}
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>Station</strong>
            <List.Content floated="right">
              {operation.station}
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>User</strong>
            <List.Content floated="right">
              {operation.user_id}
            </List.Content>
          </List.Item>
        </List>
      </Segment>
    </div>
  );
};

Details.propTypes = {
  operation: shapes.Operation,
};

Details.defaultProps = {
  operation: null,
};

export default Details;
