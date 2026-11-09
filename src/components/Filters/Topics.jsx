import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectors } from '../../redux/modules/tags';

import DeepListFilter from './DeepListFilter';

const Topics = (props) => {
  const { onFilterCancel, onFilterApplication } = props;

  return (
    <DeepListFilter
      name="topics-filter"
      onApply={onFilterApplication}
      onCancel={onFilterCancel}
      {...props}
    />
  );
};

Topics.propTypes = {
  onFilterApplication: PropTypes.func.isRequired,
  onFilterCancel: PropTypes.func.isRequired
};

const mapState = (state) => {
  return {
    emptyLabel: 'No Tags',
    hierarchy: selectors.getHierarchy(state.tags),
    getSubItemById: selectors.getTagById(state.tags),
  };
};

export default connect(mapState)(Topics);
