import React from 'react';
import { Divider, Grid } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import Properties from '../../../shared/Properties';
import Details from './Details';
import Player from './Player';
import Storages from './Storages';

const DetailsTab = (props) => {
  const { file } = props;
  if (!file) {
    return null;
  }

  return (
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width={8}>
          <Details file={file} />
          <Divider horizontal hidden />
          <Properties properties={file.properties} />
        </Grid.Column>
        <Grid.Column width={8}>
          <Player file={file} />
          <Divider horizontal hidden />
          <Storages file={file} />
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
