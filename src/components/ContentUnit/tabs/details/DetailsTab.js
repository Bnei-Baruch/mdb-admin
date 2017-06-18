import React, { Component } from 'react';
import { Divider, Grid } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import Details from './Details';
import Properties from './Properties';
import I18nForm from './I18nForm';

class DetailsTab extends Component {

  static propTypes = {
    unit: shapes.ContentUnit,
  };

  static defaultProps = {
    unit: null,
  };

  render() {
    const unit = this.props.unit;
    if (!unit) {
      return null;
    }

    return (
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={8}>
            <Details unit={unit} />
            <Divider horizontal hidden />
            <Properties properties={unit.properties} />
          </Grid.Column>
          <Grid.Column width={8}>
            <I18nForm {...this.props} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default DetailsTab;

