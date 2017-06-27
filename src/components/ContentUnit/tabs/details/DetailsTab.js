import React from 'react';
import { Divider, Grid } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import Properties from '../../../shared/Properties';
import Details from './Details';
import I18nForm from './I18nForm';

const DetailsTab = (props) => {
  const unit = props.unit;
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
          <I18nForm unit={unit} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

DetailsTab.propTypes = {
  unit: shapes.ContentUnit,
};

DetailsTab.defaultProps = {
  unit: null,
};

export default DetailsTab;

