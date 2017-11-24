import React from 'react';
import { Divider, Grid } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import ReadonlyProperties from '../../../shared/Properties';
import Details from './Details';
import I18nForm from './I18nForm';

const editableProperties = ['film_date', 'original_language'];

const DetailsTab = (props) => {
  const person = props.person;
  if (!person) {
    return null;
  }

  const readonlyProperties = Object.assign({}, person.properties);
  editableProperties.forEach(x => (delete readonlyProperties[x]));

  return (
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width={8}>
          <Details person={person} />
          <Divider horizontal hidden />
          <ReadonlyProperties properties={readonlyProperties} />
        </Grid.Column>
        <Grid.Column width={8}>
          <I18nForm person={person} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

DetailsTab.propTypes = {
  person: shapes.Person,
};

DetailsTab.defaultProps = {
  person: null,
};

export default DetailsTab;
