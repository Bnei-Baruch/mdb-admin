import React from 'react';
import moment from 'moment';
import {
  Header, Icon, List, Menu, Segment
} from 'semantic-ui-react';

import { CONTENT_TYPE_BY_ID, SECURITY_LEVELS } from '../../../../helpers/consts';
import * as shapes from '../../../shapes';

const Details = (props) => {
  const { collection } = props;
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
            <strong>ID</strong>
            <List.Content floated="right">
              {collection.id}
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>UID</strong>
            <List.Content floated="right">
              {collection.uid}
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>DB created_at</strong>
            <List.Content floated="right">
              {moment.utc(collection.created_at).format('YYYY-MM-DD HH:mm:ss')}
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>Type</strong>
            <List.Content floated="right">
              {CONTENT_TYPE_BY_ID[collection.type_id]}
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>Secure</strong>
            <List.Content floated="right">
              <Header
                size="tiny"
                content={SECURITY_LEVELS[collection.secure].text}
                color={SECURITY_LEVELS[collection.secure].color}
              />
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>Published</strong>
            <List.Content floated="right">
              {
                collection.published
                  ? <Icon name="checkmark" color="green" />
                  : <Icon name="ban" color="red" />
              }
            </List.Content>
          </List.Item>
        </List>
      </Segment>
    </div>
  );
};

Details.propTypes = {
  collection: shapes.Collection,
};

Details.defaultProps = {
  collection: null,
};

export default Details;
