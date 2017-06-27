import React from 'react';
import { Menu } from 'semantic-ui-react';

import SourceBreadcrumbs from './SourceBreadcrumbs';

const SourceMenu = props => (
  <Menu attached borderless size="large">
    <Menu.Item position="right">
      <SourceBreadcrumbs {...props} />
    </Menu.Item>
  </Menu>
);

export default SourceMenu;