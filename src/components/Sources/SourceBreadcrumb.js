import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'semantic-ui-react';

import * as shapes from '../shapes';
import { extractI18n } from '../../helpers/utils';

const SourceBreadcrumb = (props) => {
  const { source, getSourceById, getAuthorByCollectionId, lastSourceIsLink } = props;

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

  // source's ancestors
  for (let i = 0; i < path.length; i++) {
    x        = path[i];
    let name = extractI18n(x.i18n, ['name'])[0];

    let _breadcrumb = (
      <Breadcrumb.Section key={x.id} as="span" link>
        <Link to={`/sources/${x.id}`}>{name}</Link>
      </Breadcrumb.Section>
    );

    if (i === 0 && !lastSourceIsLink) {
      _breadcrumb = (<Breadcrumb.Section key={x.id} active>{name}</Breadcrumb.Section>);
    }

    crumbs.push(_breadcrumb);
    crumbs.push((<Breadcrumb.Divider key={`d${i}`} icon="left angle" />));
  }

  // author (might not be loaded yet)
  const author = getAuthorByCollectionId(x.id);
  if (author) {
    let name = extractI18n(author.i18n, ['name'])[0];
    crumbs.push((
      <Breadcrumb.Section key={author.code} as="span" link>
        <Link to={{pathname: '/sources', state: {author}}}>{name}</Link>
      </Breadcrumb.Section>
    ));
  }
  return (
    <Breadcrumb className="rtl-dir">{crumbs.reverse()}</Breadcrumb>
  );
};

SourceBreadcrumb.propTypes = {
  getSourceById          : PropTypes.func.isRequired,
  getAuthorByCollectionId: PropTypes.func.isRequired,
  source                 : shapes.Source,
  lastSourceIsLink       : PropTypes.bool
};

SourceBreadcrumb.defaultProps = {
  source          : {},
  lastSourceIsLink: false
};

export default SourceBreadcrumb;