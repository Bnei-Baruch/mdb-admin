import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Segment } from 'semantic-ui-react';

import { ContentTypeFilter, PublishedFilter, SecureFilter } from './filterComponents';

const Others = (props) => {
  const {
    namespace, onFilterApplication, contentTypes, isUpdateQuery
  } = props;

  return (
    <Segment>
      <Grid>
        <Grid.Row>
          {contentTypes === null
            ? null
            : (
              <Grid.Column width={4}>
                <Header content="Content Type" size="small" />
                <ContentTypeFilter
                  namespace={namespace}
                  name="content_type"
                  onApply={onFilterApplication}
                  isUpdateQuery={isUpdateQuery}
                  options={Array.from(Object.keys(contentTypes)).map(x => ({ key: x, value: x, text: x }))}
                />
              </Grid.Column>
            )
          }
          <Grid.Column width={4}>
            <Header content="Security Level" size="small" />
            <SecureFilter
              namespace={namespace}
              name="secure"
              onApply={onFilterApplication}
              isUpdateQuery={isUpdateQuery}
            />
          </Grid.Column>
          <Grid.Column width={4}>
            <Header content="Published" size="small" />
            <PublishedFilter
              namespace={namespace}
              name="published"
              onApply={onFilterApplication}
              isUpdateQuery={isUpdateQuery}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

Others.propTypes = {
  onFilterApplication: PropTypes.func.isRequired,
  onFilterCancel: PropTypes.func.isRequired
};

export default Others;
