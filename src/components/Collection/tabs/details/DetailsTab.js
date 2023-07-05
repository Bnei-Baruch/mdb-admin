import React from 'react';
import { Divider, Grid } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import ReadonlyProperties from '../../../shared/Properties';
import Details from './Details';
import PropertiesForm from './Properties';
import I18nForm from './I18nForm';

const editableProperties = [
  'pattern',
  'active',
  'start_date',
  'end_date',
  'film_date',
  'default_language',
  'country',
  'city',
  'full_address',
  'holiday_tag',
  'genres',
  'source',
  'tags',
  'number',
];

const DetailsTab = (props) => {
  const { collection } = props;
  if (!collection) {
    return null;
  }

  const readonlyProperties = { ...collection.properties };
  editableProperties.forEach(x => (delete readonlyProperties[x]));

  return (
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width={8}>
          <Details collection={collection} />
          <Divider horizontal hidden />
          <PropertiesForm collection={collection} />
          <Divider horizontal hidden />
          <ReadonlyProperties properties={readonlyProperties} />
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
