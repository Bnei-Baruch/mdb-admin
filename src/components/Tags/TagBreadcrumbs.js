import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'semantic-ui-react';

import { selectors } from '../../redux/modules/tags';
import * as shapes from '../shapes';
import { extractI18n } from '../../helpers/utils';

const TagBreadcrumbs = (props) => {
  const { path, lastIsLink } = props;

  // convert path to breadcrumbs
  const crumbs = [];

  // source's path
  for (let i = 0; i < path.length; i++) {
    const x     = path[i];
    const label = extractI18n(x.i18n, ['label'])[0];

    let crumb = (
      <Breadcrumb.Section key={x.id} as="span" link>
        <Link to={`/tags/${x.id}`}>{label}</Link>
      </Breadcrumb.Section>
    );

    if (i === 0 && !lastIsLink) {
      crumb = (<Breadcrumb.Section key={x.id} active>{label}</Breadcrumb.Section>);
    }

    crumbs.push(crumb);
    crumbs.push((<Breadcrumb.Divider key={`d${i}`} icon="left angle" />));
  }
  crumbs.pop();

  return (
    <Breadcrumb className="rtl-dir">{crumbs.reverse()}</Breadcrumb>
  );
};

TagBreadcrumbs.propTypes = {
  tag: shapes.Tag.isRequired,
  path: PropTypes.arrayOf(shapes.Tag),
  lastIsLink: PropTypes.bool
};

TagBreadcrumbs.defaultProps = {
  path: [],
  author: null,
  lastIsLink: false
};

const mapState = (state, ownProps) => {
  const { tag } = ownProps;
  return {
    path: selectors.getPathByID(state.tags)(tag.id),
  };
};

export default connect(mapState)(TagBreadcrumbs);
