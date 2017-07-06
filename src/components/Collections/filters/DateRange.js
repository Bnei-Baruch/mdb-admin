import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Segment } from 'semantic-ui-react';

import { NS_COLLECTIONS } from '../../../helpers/consts';
import { DateFilter } from '../../Filters/filterComponents';

const DateRange = props => (
  <Segment>
    <Grid>
      <Grid.Row>
        <Grid.Column width={4}>
          <Header content="Date Range" size="small" />
          <DateFilter
            namespace={NS_COLLECTIONS}
            name="start_date"
            onApply={props.onFilterApplication}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Segment>
);

DateRange.propTypes = {
  onFilterApplication: PropTypes.func.isRequired
};

export default DateRange;

