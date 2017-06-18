import React from 'react';
import PropTypes from 'prop-types';
import { Header, Menu, Segment } from 'semantic-ui-react';

const Properties = props => (
  <div>
    <Menu attached borderless size="large">
      <Menu.Item header>
        <Header content="Extra properties" size="medium" color="blue" />
      </Menu.Item>
    </Menu>
    <Segment attached>
      <pre>
        {JSON.stringify(props.properties, null, 2)}
      </pre>
    </Segment>
  </div>
);

Properties.propTypes = {
  properties: PropTypes.object,
};

Properties.defaultProps = {
  properties: {},
};

export default Properties;
