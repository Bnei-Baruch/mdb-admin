import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'semantic-ui-react';
import SourceBreadcrumb from './SourceBreadcrumb';

const SourceMenu = (props) => {

  return (
    <Menu attached borderless size="large">
      <Menu.Item position="right">
        <SourceBreadcrumb {...props} />
      </Menu.Item>
    </Menu>
  );
};

export default SourceMenu;