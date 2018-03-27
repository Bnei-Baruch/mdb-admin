import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { EMPTY_ARRAY, EMPTY_OBJECT } from '../../../../helpers/consts';
import { actions, selectors } from '../../../../redux/modules/collections';
import { selectors as units } from '../../../../redux/modules/content_units';
import * as shapes from '../../../shapes';
import AssociationsContainer from './AssociationsContainer';
import NewAssociationsContainer from './NewAssociations/NewAssociationsContainer';
import './style.css';

class AssociationsTab extends Component {

  static propTypes = {
    fetchItemUnits: PropTypes.func.isRequired,
    collection: shapes.Collection,
  };

  static defaultProps = {
    collection: null,
  };

  state = {
    editMode: false
  };

  componentDidMount() {
    const { collection } = this.props;
    if (collection) {
      this.askForData(collection.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.collection && !this.props.collection && nextProps.collection.id !== this.props.collection.id) {
      this.askForData(nextProps.collection.id);
    }
  }

  askForData(id) {
    this.props.fetchItemUnits(id);
  }

  setEditMode = editMode =>
    this.setState({ editMode });

  render() {
    if (this.state.editMode) {
      return (<NewAssociationsContainer {...this.props} setEditMode={this.setEditMode} />);
    }
    return (<AssociationsContainer {...this.props} setEditMode={this.setEditMode} />);
  }
}

function orderUnits(u1, u2) {
  if (u1.content_unit.type_id !== u2.content_unit.type_id) {
    return u1.content_unit.type_id > u2.content_unit.type_id ? 1 : -1;
  }

  if (u1.position !== u2.position) {
    return u1.position > u2.position ? 1 : -1;
  }

  const d1 = new Date(u1.content_unit.created_at);
  const d2 = new Date(u2.content_unit.created_at);
  return d1 > d2 ? 1 : d1 === d2 ? 0 : -1;
}

const mapState = (state, ownProps) => {
  const { collection = EMPTY_OBJECT } = ownProps;
  const unitIDs                       = collection.content_units;
  const denormCCUs                    = units.denormCCUs(state.content_units);
  const CCUs                          = unitIDs ? denormCCUs(unitIDs).sort(orderUnits) : EMPTY_ARRAY;

  return {
    units: CCUs,
    associatedCUIds: collection.content_units ?
      new Map(collection.content_units.map(x => [x.content_unit_id, true])) :
      new Map(),
    wip: selectors.getWIP(state.collections, 'fetchItemUnits'),
    err: selectors.getError(state.collections, 'fetchItemUnits'),
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchItemUnits: actions.fetchItemUnits,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(AssociationsTab);
