import React from 'react';
import { Menu } from 'semantic-ui-react';

import SourceBreadcrumb from './SourceBreadcrumb';

const SourceMenu = props => (
  <Menu attached borderless size="large">
    <Menu.Item position="right">
      <SourceBreadcrumb {...props} />
    </Menu.Item>
  </Menu>
);

export default SourceMenu;