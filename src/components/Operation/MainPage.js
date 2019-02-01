import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Divider, Grid } from 'semantic-ui-react';

import { formatError } from '../../helpers/utils';
import * as shapes from '../shapes';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../shared/Splash';
import Properties from '../shared/Properties';
import Details from './Details';
import Files from './Files';

const MainPage = (props) => {
  const { operation, wip, err } = props;

  if (err) {
    return <ErrorSplash text="Server Error" subtext={formatError(err)} />;
  }

  if (operation) {
    return (
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={6}>
            <Details operation={operation} />
            <Divider horizontal hidden />
            <Properties properties={operation.properties} />
          </Grid.Column>
          <Grid.Column width={10}>
            <Files operation={operation} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return wip
    ? <LoadingSplash text="Loading operation details" subtext="Hold on tight..." />
    : (
      <FrownSplash
        text="Couldn't find operation"
        subtext={<span>Try the <Link to="/operations">operations list</Link>...</span>}
      />
    );
};

MainPage.propTypes = {
  operation: shapes.Operation,
  wip: PropTypes.bool,
  err: shapes.Error,
};

MainPage.defaultProps = {
  operation: null,
  wip: false,
  err: null,
};

export default MainPage;
