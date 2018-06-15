import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { selectors, actions } from '../../../../redux/modules/content_units';
import { selectors as system } from '../../../../redux/modules/system';

import * as shapes from '../../../shapes';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '../../../../helpers/consts';

import HierarchyUnitsView from './HierarchyUnitsView';

class DerivativesContainer extends Component {

  static propTypes = {
    cuds: PropTypes.arrayOf(shapes.ContentUnitDerivation),
    wip: PropTypes.bool,
    err: shapes.Error,
  };

  static defaultProps = {
    cuds: EMPTY_ARRAY,
    wip: false,
    err: null,
  };

  render() {
    return <HierarchyUnitsView blockName="Derivatives" {...this.props} />;
  }
}

const mapState = (state, ownProps) => {
  const { unit = EMPTY_OBJECT }            = ownProps;
  const { origins = [], derivatives = [] } = unit;

  const denormCUDs = selectors.denormCUDs(state.content_units);
  return {
    cuds: derivatives.length > 0 ? denormCUDs(derivatives) : EMPTY_ARRAY,
    wip: selectors.getWIP(state.content_units, 'fetchItemDerivatives'),
    err: selectors.getError(state.content_units, 'fetchItemDerivatives'),
    currentLanguage: system.getCurrentLanguage(state.system),
    associatedIds: [...origins, ...derivatives].map(cu => cu.content_unit_id),
    wipAssociate: selectors.getWIP(state.content_units, 'addItemDerivatives'),
    errAssociate: selectors.getError(state.content_units, 'addItemDerivatives'),
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    associate: actions.addItemDerivatives,
    removeAssociate: actions.removeItemDerivatives,
    updateAssociation: actions.updateItemDerivatives,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(DerivativesContainer);
