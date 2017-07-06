import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment } from 'semantic-ui-react';

const Others = props => (
  <Segment>
    <Grid>
      <Grid.Row>
        Not Implemented yet...
      </Grid.Row>
    </Grid>
  </Segment>
);

Others.propTypes = {
  onFilterApplication: PropTypes.func.isRequired
};

export default Others;

