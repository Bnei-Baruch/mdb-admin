import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import { actions, selectors } from '../../../../redux/modules/collections';
import { selectors as units } from '../../../../redux/modules/content_units';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '../../../../helpers/consts';
import Units from './Units';

class AssociationsTab extends PureComponent {

  static propTypes = {
    fetchItemUnits: PropTypes.func.isRequired,
    collection: shapes.Collection,
  };

  static defaultProps = {
    collection: undefined,
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

  render() {
    return (
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={8}>
            <Units {...this.props} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapState = (state, ownProps) => {
  const { collection = EMPTY_OBJECT } = ownProps;
  const unitIds = collection.content_units;
  const denormCCUs = units.denormCCUs(state.content_units);
  return {
    units: unitIds ? denormCCUs(unitIds) : EMPTY_ARRAY,
    wip: selectors.getWIP(state.collections, 'fetchItemUnits'),
    err: selectors.getError(state.collections, 'fetchItemUnits'),
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({ fetchItemUnits: actions.fetchItemUnits }, dispatch);
}

export default connect(mapState, mapDispatch)(AssociationsTab);
