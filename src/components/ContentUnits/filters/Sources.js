import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { selectors } from '../../../redux/modules/sources';

import { NS_UNITS } from '../../../helpers/consts';
import DeepListFilter from '../../Filters/DeepListFilter';

const Sources = props => (
  <DeepListFilter
    namespace={NS_UNITS}
    name="deep-list"
    onApply={props.onFilterApplication}
    {...props}
  />
);

Sources.propTypes = {
  onFilterApplication: PropTypes.func.isRequired
};

export default connect(
  state => ({
    emptyLabel: 'No Sources',
    roots: selectors.getRoots(state.sources),
    getSubItemById: selectors.getSourceById(state.sources),
  })
)(Sources);

