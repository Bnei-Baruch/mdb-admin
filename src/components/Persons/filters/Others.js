import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Segment } from 'semantic-ui-react';

import { NS_PERSONS } from '../../../helpers/consts';
import { ContentTypeFilter, SecureFilter, PublishedFilter } from '../../Filters/filterComponents';

const Others = props => (
  <Segment>
    <Grid>
      <Grid.Row>
        <Grid.Column width={4}>
          <Header content="Content Type" size="small" />
          <ContentTypeFilter
            namespace={NS_PERSONS}
            name="content_type"
            onApply={props.onFilterApplication}
          />
        </Grid.Column>
        <Grid.Column width={4}>
          <Header content="Security Level" size="small" />
          <SecureFilter
            namespace={NS_PERSONS}
            name="secure"
            onApply={props.onFilterApplication}
          />
        </Grid.Column>
        <Grid.Column width={4}>
          <Header content="Published" size="small" />
          <PublishedFilter
            namespace={NS_PERSONS}
            name="published"
            onApply={props.onFilterApplication}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Segment>
);

Others.propTypes = {
  onFilterApplication: PropTypes.func.isRequired
};

export default Others;