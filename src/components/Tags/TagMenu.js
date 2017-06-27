import React from 'react';
import { Menu } from 'semantic-ui-react';

import TagBreadcrumbs from './TagBreadcrumbs';

const TagMenu = props => (
  <Menu attached borderless size="large">
    <Menu.Item position="right">
      <TagBreadcrumbs {...props} />
    </Menu.Item>
  </Menu>
);

export default TagMenu;