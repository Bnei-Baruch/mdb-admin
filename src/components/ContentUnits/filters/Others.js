import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Segment } from 'semantic-ui-react';

import { NS_UNITS, CONTENT_UNIT_TYPES } from '../../../helpers/consts';
import { ContentTypeFilter, PublishedFilter, SecureFilter } from '../../Filters/filterComponents';

const Others = props => (
  <Segment>
    <Grid>
      <Grid.Row>
        <Grid.Column width={4}>
          <Header content="Content Type" size="small" />
          <ContentTypeFilter
            namespace={NS_UNITS}
            name="content_type"
            onApply={props.onFilterApplication}
            options={Array.from(Object.keys(CONTENT_UNIT_TYPES)).map(x => ({ key: x, value: x, text: x }))}
          />
        </Grid.Column>
        <Grid.Column width={4}>
          <Header content="Security Level" size="small" />
          <SecureFilter
            namespace={NS_UNITS}
            name="secure"
            onApply={props.onFilterApplication}
          />
        </Grid.Column>
        <Grid.Column width={4}>
          <Header content="Published" size="small" />
          <PublishedFilter
            namespace={NS_UNITS}
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

