import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { selectors } from '../../redux/modules/sources';
import { selectors as authors } from '../../redux/modules/authors';

import DeepListFilter from './DeepListFilter';

const Sources = props => {
  const { onFilterCancel, onFilterApplication } = props;
  return (<DeepListFilter
    name="sources-filter"
    onApply={onFilterApplication}
    onCancel={onFilterCancel}
    {...props}
  />);
};

Sources.propTypes = {
  onFilterApplication: PropTypes.func.isRequired,
  onFilterCancel: PropTypes.func.isRequired
};

const insertAuthorsToHierarchy = (hierarchy, authors) => {
  const { childMap } = hierarchy;
  let roots          = [];
  authors.forEach(a => {
    childMap.set(a.code, a.sources);
    roots.push(a.code);
  });
  return { roots, childMap };
};

const modifyAuthorData = author => ({ ...author, id: author.code });

const mapState = (state) => {
  const getSources = selectors.getSourceById(state.sources);
  const getAuthors = authors.getAuthorByCode(state.authors);

  return {
    emptyLabel: 'No Sources',
    hierarchy: insertAuthorsToHierarchy(selectors.getHierarchy(state.sources), authors.getAuthorsList(state.authors)),
    getSubItemById: id => isNaN(id) ? modifyAuthorData(getAuthors(id)) : getSources(id)
  };
};

export default connect(mapState)(Sources);

