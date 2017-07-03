import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'semantic-ui-react';

import { selectors as sources } from '../../redux/modules/sources';
import { selectors as authors } from '../../redux/modules/authors';
import { extractI18n } from '../../helpers/utils';
import * as shapes from '../shapes';

const SourceBreadcrumbs = (props) => {
  const { path, author, lastIsLink } = props;

  // convert path to breadcrumbs
  const crumbs = [];

  // source's path
  for (let i = 0; i < path.length; i++) {
    const x    = path[i];
    const name = extractI18n(x.i18n, ['name'])[0];

    let crumb = (
      <Breadcrumb.Section key={x.id} as="span" link>
        <Link to={`/sources/${x.id}`}>{name}</Link>
      </Breadcrumb.Section>
    );

    if (i === 0 && !lastIsLink) {
      crumb = (<Breadcrumb.Section key={x.id} active>{name}</Breadcrumb.Section>);
    }

    crumbs.push(crumb);
    crumbs.push((<Breadcrumb.Divider key={`d${i}`} icon="left angle" />));
  }

  // author
  if (author) {
    const name = extractI18n(author.i18n, ['name'])[0];
    crumbs.push((
      <Breadcrumb.Section key={author.code} as="span" link>
        <Link to={{ pathname: '/sources', state: { author } }}>{name}</Link>
      </Breadcrumb.Section>
    ));
  }
  return (
    <Breadcrumb className="rtl-dir">{crumbs.reverse()}</Breadcrumb>
  );
};

SourceBreadcrumbs.propTypes = {
  source: shapes.Source.isRequired,
  path: PropTypes.arrayOf(shapes.Source),
  author: shapes.Author,
  lastIsLink: PropTypes.bool
};

SourceBreadcrumbs.defaultProps = {
  path: [],
  author: null,
  lastIsLink: false
};

const mapState = (state, ownProps) => {
  const { source } = ownProps;
  const path       = sources.getPathByID(state.sources)(source.id);
  const root       = path.length === 0 ? null : path[path.length - 1];
  return {
    path,
    author: root ? authors.getAuthorByCollectionId(state.authors)(root.id) : null,
  };
};

export default connect(mapState)(SourceBreadcrumbs);
