import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import * as shapes from '../shapes';
import SourceBreadcrumbs from './SourceBreadcrumbs';

const SourceMenu = props => (
  <Menu attached borderless size="large">
    <Menu.Item position="">
      <Link to={`/content_units/${props.source.cuid}`}>
        {`Unit ${JSON.stringify(props.source.cuid)}`}
      </Link>
    </Menu.Item>
    <Menu.Item position="right">
      <SourceBreadcrumbs source={props.source} />
    </Menu.Item>
  </Menu>
);

SourceMenu.propTypes = {
  source: shapes.Source.isRequired,
};

export default SourceMenu;
