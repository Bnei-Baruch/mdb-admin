import React from 'react';
import { Divider, Grid } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import Properties from '../../../shared/Properties';
import Details from './Details';
import PropertiesForm from './PropertiesForm';
import I18nForm from './I18nForm';

const DetailsTab = (props) => {
  const unit = props.unit;
  if (!unit) {
    return null;
  }
  const notEditableProperties = DetailsTab.getEditableProperties(unit.properties).reduce((result, p) => {
    delete result[p];
    return result;
  }, Object.assign({}, unit.properties));
  const editableProperties    = DetailsTab.getEditableProperties(unit.properties).reduce((result, p) => {
    result[p] = unit.properties[p];
    return result;
  }, {});

  return (
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width={8}>
          <Details unit={unit} />
          <Divider horizontal hidden />
          <PropertiesForm properties={editableProperties} contentUnit={unit} />
          <Divider horizontal hidden />
          <Properties properties={notEditableProperties} />
        </Grid.Column>
        <Grid.Column width={8}>
          <I18nForm unit={unit} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

DetailsTab.getEditableProperties = (properties) => {
  return Object.keys(properties).filter(p => {
    switch (p) {
    case 'film_date':
    case 'duration':
    case 'original_language':
      return true;
    default:
      return false;
    }
  });
};

DetailsTab.propTypes = {
  unit: shapes.ContentUnit,
};

DetailsTab.defaultProps = {
  unit: null,
};

export default DetailsTab;