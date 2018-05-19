import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Segment } from 'semantic-ui-react';

import { NS_OPERATIONS } from '../../../helpers/consts';
import { OperationTypeFilter } from '../../Filters/filterComponents';

const Others = props => (
  <Segment>
    <Grid>
      <Grid.Row>
        <Grid.Column width={4}>
          <Header content="Operation Type" size="small" />
          <OperationTypeFilter
            namespace={NS_OPERATIONS}
            name="operation_type"
            onApply={props.onFilterApplication}
            isUpdateQuery={true}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Segment>
);

Others.propTypes = {
  onFilterApplication: PropTypes.func.isRequired,
  onFilterCancel: PropTypes.func.isRequired
};

export default Others;

