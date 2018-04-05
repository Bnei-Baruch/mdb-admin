import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { NS_UNITS } from '../../../helpers/consts';
import { selectors } from '../../../redux/modules/tags';

import DeepListFilter from '../../Filters/DeepListFilter';

const Topics = props => (
  <DeepListFilter
    namespace={NS_UNITS}
    name="topics-filter"
    onApply={props.onFilterApplication}
    {...props}
  />
);

Topics.propTypes              = {
  onFilterApplication: PropTypes.func.isRequired
};

const mapState = (state) => {
  return {
    emptyLabel: 'No Tags',
    hierarchy: selectors.getHierarchy(state.tags),
    //roots: selectors.getRoots(state.tags).filter(x => TOPICS_FOR_DISPLAY.indexOf(x) !== -1),
    getSubItemById: selectors.getTagById(state.tags),
  };
};

export default connect(mapState)(Topics);