import React from 'react';
import PropTypes from 'prop-types';
import { Header, Menu, Message, Segment } from 'semantic-ui-react';

const Properties = props => (
  <div>
    <Menu attached borderless size="large">
      <Menu.Item header>
        <Header content="Extra properties" size="medium" color="blue" />
      </Menu.Item>
    </Menu>
    <Segment attached>
      {
        props.properties ?
          <pre>{JSON.stringify(props.properties, null, 2)}</pre> :
          <Message>No properties</Message>
      }
    </Segment>
  </div>
);

Properties.propTypes = {
  properties: PropTypes.object,
};

Properties.defaultProps = {
  properties: null,
};

export default Properties;
