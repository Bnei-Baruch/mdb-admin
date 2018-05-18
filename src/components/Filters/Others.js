import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Segment } from 'semantic-ui-react';

import { ContentTypeFilter, PublishedFilter, SecureFilter } from './filterComponents';

const Others = props => {
  return (
    <Segment>
      <Grid>
        <Grid.Row>
          {props.withoutType ? null :
          <Grid.Column width={4}>
            <Header content="Content Type" size="small" />
            <ContentTypeFilter
              namespace={props.namespace}
              name="content_type"
              onApply={props.onFilterApplication}
              isUpdateQuery={true}
              options={Array.from(Object.keys(props.contentTypes)).map(x => ({ key: x, value: x, text: x }))}
            />
          </Grid.Column>}
          <Grid.Column width={4}>
            <Header content="Security Level" size="small" />
            <SecureFilter
              namespace={props.namespace}
              name="secure"
              onApply={props.onFilterApplication}
              isUpdateQuery={true}
            />
          </Grid.Column>
            <Grid.Column width={4}>
              <Header content="Published" size="small" />
              <PublishedFilter
                namespace={props.namespace}
                name="published"
                onApply={props.onFilterApplication}
                isUpdateQuery={true}
              />
            </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

Others.propTypes = {
  onFilterApplication: PropTypes.func.isRequired
};

export default Others;

