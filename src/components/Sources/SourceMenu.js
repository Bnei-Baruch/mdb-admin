import React from 'react';
import { Menu } from 'semantic-ui-react';

import * as shapes from '../shapes';
import SourceBreadcrumbs from './SourceBreadcrumbs';

const SourceMenu = props => (
  <Menu attached borderless size="large">
    <Menu.Item position="right">
      <SourceBreadcrumbs source={props.source} />
    </Menu.Item>
  </Menu>
);

SourceMenu.propTypes = {
  source: shapes.Source.isRequired,
};

export default SourceMenu;
