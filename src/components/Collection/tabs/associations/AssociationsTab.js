import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { EMPTY_ARRAY, EMPTY_OBJECT } from '../../../../helpers/consts';
import { actions, selectors } from '../../../../redux/modules/collections';
import { selectors as units } from '../../../../redux/modules/content_units';
import * as shapes from '../../../shapes';
import AssociationsContainer from './AssociationsContainer';
import NewAssociations from './NewAssociations';
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

  componentDidUpdate(prevProps) {
    if (this.props.collection && !prevProps.collection && this.props.collection.id !== prevProps.collection.id) {
      this.askForData(this.props.collection.id);
    }
  }

  askForData(id) {
    this.props.fetchItemUnits(id);
  }

  setEditMode = editMode =>
    this.setState({ editMode });

  render() {
    const {
      collection, associatedCUs, associatedCUIds, fetchItemUnits
    } = this.props;

    if (this.state.editMode) {
      return (
        <NewAssociations
          collection={collection}
          associatedIds={associatedCUIds}
          setEditMode={this.setEditMode}
        />
      );
    }
    return (
      <AssociationsContainer
        setEditMode={this.setEditMode}
        units={associatedCUs}
        collection={collection}
        fetchItemUnits={fetchItemUnits}
      />
    );
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

  if (d1 > d2) {
    return 1;
  }
  if (d1 === d2) {
    return 0;
  }
  return -1;
}

const mapState = (state, ownProps) => {
  const { collection = EMPTY_OBJECT } = ownProps;
  const denormCCUs                    = units.denormCCUs(state.content_units);

  return {
    associatedCUs: collection.content_units ? denormCCUs(collection.content_units).sort(orderUnits) : EMPTY_ARRAY,
    associatedCUIds: collection.content_units ? collection.content_units.map(x => x.content_unit_id) : [],
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
