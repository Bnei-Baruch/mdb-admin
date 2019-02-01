import React from 'react';
import { Divider, Grid } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import ReadonlyProperties from '../../../shared/Properties';
import PersonInfoForm from './PersonInfoForm';
import I18nForm from './I18nForm';

const DetailsTab = (props) => {
  const { person } = props;
  if (!person) {
    return null;
  }

  const readonlyProperties = Object.assign({}, person.properties);

  return (
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width={8}>
          <PersonInfoForm {...props} />
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
