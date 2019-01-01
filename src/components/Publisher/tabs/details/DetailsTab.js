import React from 'react';
import { Divider, Grid } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import ReadonlyProperties from '../../../shared/Properties';
import PublisherInfoForm from './PublisherInfoForm';
import I18nForm from './I18nForm';

const DetailsTab = (props) => {
  const { publisher } = props;
  if (!publisher) {
    return null;
  }

  const readonlyProperties = Object.assign({}, publisher.properties);

  return (
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width={8}>
          <PublisherInfoForm {...props} />
          <Divider horizontal hidden />
          <ReadonlyProperties properties={readonlyProperties} />
        </Grid.Column>
        <Grid.Column width={8}>
          <I18nForm publisher={publisher} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

DetailsTab.propTypes = {
  publisher: shapes.Publisher,
};

DetailsTab.defaultProps = {
  publisher: null,
};

export default DetailsTab;
