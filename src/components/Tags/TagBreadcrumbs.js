import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'semantic-ui-react';

import { extractI18n } from '../../helpers/utils';
import { selectors } from '../../redux/modules/tags';
import { selectors as system } from '../../redux/modules/system';
import * as shapes from '../shapes';

const TagBreadcrumbs = (props) => {
  const { path, lastIsLink, currentLanguage } = props;

  // convert path to breadcrumbs
  const crumbs = [];

  // source's path
  for (let i = 0; i < path.length; i++) {
    const x     = path[i];
    const label = extractI18n(x.i18n, ['label'], currentLanguage)[0];

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
  lastIsLink: PropTypes.bool,
  currentLanguage: PropTypes.string.isRequired,
};

TagBreadcrumbs.defaultProps = {
  path: [],
  lastIsLink: false
};

const mapState = (state, ownProps) => {
  const { tag } = ownProps;
  return {
    path: selectors.getPathByID(state.tags)(tag.id),
    currentLanguage: system.getCurrentLanguage(state.system),
  };
};

export default connect(mapState)(TagBreadcrumbs);
