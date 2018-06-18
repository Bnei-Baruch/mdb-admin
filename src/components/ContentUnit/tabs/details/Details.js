import React from 'react';
import moment from 'moment';
import { Header, Icon, List, Menu, Segment } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import { CONTENT_TYPE_BY_ID, SECURITY_LEVELS } from '../../../../helpers/consts';

const Details = (props) => {
  const { unit } = props;
  if (!unit) {
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
              {unit.id}
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>UID</strong>
            <List.Content floated="right">
              {unit.uid}
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>DB created_at</strong>
            <List.Content floated="right">
              {moment.utc(unit.created_at).format('YYYY-MM-DD HH:mm:ss')}
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>Type</strong>
            <List.Content floated="right">
              {CONTENT_TYPE_BY_ID[unit.type_id]}
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>Secure</strong>
            <List.Content floated="right">
              <Header
                size="tiny"
                content={SECURITY_LEVELS[unit.secure].text}
                color={SECURITY_LEVELS[unit.secure].color}
              />
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>Published</strong>
            <List.Content floated="right">
              {
                unit.published ?
                  <Icon name="checkmark" color="green" /> :
                  <Icon name="ban" color="red" />
              }
            </List.Content>
          </List.Item>
        </List>
      </Segment>
    </div>
  );
};

Details.propTypes = {
  unit: shapes.ContentUnit,
};

Details.defaultProps = {
  unit: null,
};

export default Details;
