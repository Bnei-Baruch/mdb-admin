import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Breadcrumb, Menu } from 'semantic-ui-react';

import * as shapes from '../shapes';
import { extractI18n } from '../../helpers/utils';

const SourceMenu = (props) => {
  const { source, getSourceById, getAuthorByCollectionId } = props;

  // construct path
  // note that hierarchy is still being loaded...
  let x      = source;
  const path = [source];
  while (x && x.parent_id) {
    x = getSourceById(x.parent_id);
    if (x) {
      path.push(x);
    }
  }

  // convert path to breadcrumbs
  const crumbs = [];

  // current source
  x        = path[0];
  let name = extractI18n(x.i18n, ['name'])[0];
  crumbs.push((<Breadcrumb.Section key={x.id} active>{name}</Breadcrumb.Section>));
  crumbs.push((<Breadcrumb.Divider key="d0" icon="left angle" />));

  // source's ancestors
  for (let i = 1; i < path.length; i++) {
    x    = path[i];
    name = extractI18n(x.i18n, ['name'])[0];
    crumbs.push((
      <Breadcrumb.Section key={x.id} as="span" link>
        <Link to={`/sources/${x.id}`}>{name}</Link>
      </Breadcrumb.Section>
    ));
    crumbs.push((<Breadcrumb.Divider key={`d${i}`} icon="left angle" />));
  }

  // author (might not be loaded yet)
  const author = getAuthorByCollectionId(x.id);
  if (author) {
    name = extractI18n(author.i18n, ['name'])[0];
    crumbs.push((
      <Breadcrumb.Section key={author.code} as="span" link>
        <Link to={{ pathname: '/sources', state: { author } }}>{name}</Link>
      </Breadcrumb.Section>
    ));
  }

  return (
    <Menu attached borderless size="large">
      <Menu.Item position="right">
        <Breadcrumb className="rtl-dir">
          {crumbs.reverse()}
        </Breadcrumb>
      </Menu.Item>
    </Menu>
  );
};

SourceMenu.propTypes = {
  getSourceById: PropTypes.func.isRequired,
  getAuthorByCollectionId: PropTypes.func.isRequired,
  source: shapes.Source,
};

SourceMenu.defaultProps = {
  source: {},
};

export default SourceMenu;
