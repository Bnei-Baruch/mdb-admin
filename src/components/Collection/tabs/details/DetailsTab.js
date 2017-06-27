import React from 'react';
import { Divider, Grid } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import Properties from '../../../shared/Properties';
import Details from './Details';
import I18nForm from './I18nForm';

const DetailsTab = (props) => {
  const collection = props.collection;
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
          <I18nForm collection={collection} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

DetailsTab.propTypes = {
  collection: shapes.Collection,
};

DetailsTab.defaultProps = {
  collection: null,
};

export default DetailsTab;

