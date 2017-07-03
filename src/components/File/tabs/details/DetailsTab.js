import React from 'react';
import { Divider, Grid } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import Properties from '../../../shared/Properties';
import Details from './Details';
import Player from './Player';

const DetailsTab = (props) => {
  const file = props.file;
  if (!file) {
    return null;
  }

  return (
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width={10}>
          <Details file={file} />
          <Divider horizontal hidden />
          <Properties properties={file.properties} />
        </Grid.Column>
        <Grid.Column width={6} textAlign="center">
          <Player file={file} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

DetailsTab.propTypes = {
  file: shapes.File,
};

DetailsTab.defaultProps = {
  file: null,
};

export default DetailsTab;

