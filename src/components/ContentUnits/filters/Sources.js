import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { selectors } from '../../../redux/modules/sources';

import { NS_UNITS } from '../../../helpers/consts';
import DeepListFilter from '../../Filters/DeepListFilter';

const Sources = props => (
  <DeepListFilter
    namespace={NS_UNITS}
    name="sources-filter"
    onApply={props.onFilterApplication}
    {...props}
  />
);

Sources.propTypes = {
  onFilterApplication: PropTypes.func.isRequired
};

const mapState = (state) => {
  return {
    emptyLabel: 'No Sources',
    hierarchy: selectors.getHierarchy(state.sources),
    getSubItemById: selectors.getSourceById(state.sources)
  };
};

export default connect(mapState)(Sources);

