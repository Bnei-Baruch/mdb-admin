import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import Units from './Units';

class AssociationsTab extends Component {

  static propTypes = {
    fetchItemUnits: PropTypes.func.isRequired,
    collection: shapes.Collection,
  };

  static defaultProps = {
    collection: null,
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

export default AssociationsTab;

