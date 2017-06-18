import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Divider, Grid } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import Collections from './Collections';
import Sources from './Sources';
import Tags from './Tags';

class AssociationsTab extends Component {

  static propTypes = {
    fetchItemCollections: PropTypes.func.isRequired,
    fetchItemSources: PropTypes.func.isRequired,
    fetchItemTags: PropTypes.func.isRequired,
    unit: shapes.ContentUnit,
  };

  static defaultProps = {
    unit: null,
  };

  componentDidMount() {
    const { unit } = this.props;
    if (unit) {
      this.askForData(unit.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.unit && !this.props.unit && nextProps.unit.id !== this.props.unit.id) {
      this.askForData(nextProps.unit.id);
    }
  }

  askForData(id) {
    this.props.fetchItemCollections(id);
    this.props.fetchItemSources(id);
    this.props.fetchItemTags(id);
  }

  render() {
    return (
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={8}>
            <Collections {...this.props} />
          </Grid.Column>
          <Grid.Column width={8}>
            <Sources {...this.props} />
            <Divider horizontal hidden />
            <Tags {...this.props} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default AssociationsTab;

