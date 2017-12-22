import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { EMPTY_ARRAY, EMPTY_OBJECT, NS_FILE_UNITS } from '../../../../helpers/consts';
import { actions, selectors } from '../../../../redux/modules/lists';
import { actions as fileActions } from '../../../../redux/modules/files';
import { selectors as unitsSelectors } from '../../../../redux/modules/content_units';
import * as shapes from '../../../shapes';
import NewAssociations from './NewAssociations';

class AssociationsTab extends Component {

  static propTypes = {
    file: shapes.File,
    units: PropTypes.arrayOf(shapes.ContentUnit),
    fetchList: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
    updateProperties: PropTypes.func.isRequired,
  };

  render() {
    return (
      <NewAssociations {...this.props} />
    );
  }
}

const mapState = (state) => {
  const status    = selectors.getNamespaceState(state.lists, NS_FILE_UNITS) || EMPTY_OBJECT;
  const denormIDs = unitsSelectors.denormIDs(state.content_units);
  return {
    ...status,
    items: Array.isArray(status.items) && status.items.length > 0 ? denormIDs(status.items) : EMPTY_ARRAY,
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchList: actions.fetchList,
    setPage: actions.setPage,
    updateProperties: fileActions.updateProperties,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(AssociationsTab);
