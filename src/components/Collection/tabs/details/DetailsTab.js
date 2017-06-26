import React, { Component } from 'react';
import { Divider, Grid } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import Properties from '../../../shared/Properties';
import Details from './Details';
import I18nForm from './I18nForm';

class DetailsTab extends Component {

  static propTypes = {
    collection: shapes.Collection,
  };

  static defaultProps = {
    collection: null,
  };

  render() {
    const collection = this.props.collection;
    if (!collection) {
      return null;
    }

    return (
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={8}>
            <Details collection={collection} />
            <Divider horizontal hidden />
            <Properties properties={collection.properties} />
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

