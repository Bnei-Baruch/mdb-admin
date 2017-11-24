import React from 'react';
import moment from 'moment';
import { Header, Icon, List, Menu, Segment } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import { CONTENT_TYPE_BY_ID, SECURITY_LEVELS } from '../../../../helpers/consts';

const Details = (props) => {
  const { person } = props;
  if (!person) {
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
              {person.id}
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>UID</strong>
            <List.Content floated="right">
              {person.uid}
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>Pattern</strong>
            <List.Content floated="right">
              {person.pattern}
            </List.Content>
          </List.Item>
        </List>
      </Segment>
    </div>
  );
};

Details.propTypes = {
  person: shapes.Person,
};

Details.defaultProps = {
  person: null,
};

export default Details;
