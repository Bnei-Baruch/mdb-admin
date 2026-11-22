import React from 'react';
import {
  Header, Icon, List, Menu, Segment
} from '../../../ui';

import { CONTENT_TYPE_BY_ID, SECURITY_LEVELS } from '../../../../helpers/consts';
import * as shapes from '../../../shapes';
import { formatUTC } from '../../../../helpers/date';

const Details = props => {
  const { collection = null } = props;
  if (!collection) {
    return null;
  }

  return (
    <div>
      <Menu attached borderless size="large">
        <Menu.Item header>
          <Header content="Details" size="medium" color="blue" />
        </Menu.Item>
      </Menu>

      <Segment attached>
        <List divided relaxed>
          <List.Item>
            <List.Content floated="right">
              {collection.id}
            </List.Content>
            <List.Header>ID</List.Header>
          </List.Item>
          <List.Item>
            <List.Content floated="right">
              {collection.uid}
            </List.Content>
            <List.Header>UID</List.Header>
          </List.Item>
          <List.Item>
            <List.Content floated="right">
              {formatUTC(collection.created_at)}
            </List.Content>
            <List.Header>DB created_at</List.Header>
          </List.Item>
          <List.Item>
            <List.Content floated="right">
              {CONTENT_TYPE_BY_ID[collection.type_id]}
            </List.Content>
            <List.Header>Type</List.Header>
          </List.Item>
          <List.Item>
            <List.Content floated="right">
              <Header
                size="tiny"
                content={SECURITY_LEVELS[collection.secure].text}
                color={SECURITY_LEVELS[collection.secure].color}
              />
            </List.Content>
            <List.Header>Secure</List.Header>
          </List.Item>
          <List.Item>
            <List.Content floated="right">
              {
                collection.published
                  ? <Icon name="checkmark" color="green" />
                  : <Icon name="ban" color="red" />
              }
            </List.Content>
            <List.Header>Published</List.Header>
          </List.Item>
        </List>
      </Segment>
    </div>
  );
};

Details.propTypes = {
  collection: shapes.Collection,
};

export default Details;
