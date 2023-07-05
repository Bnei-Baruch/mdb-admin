import React from 'react';
import PropTypes from 'prop-types';
import { Divider, Grid } from 'semantic-ui-react';
import ReadonlyProperties from '../../../shared/Properties';
import LabelInfoForm from './LabelInfoForm';
import I18nForm from './I18nForm';

const DetailsTab = (props) => {
  const { label } = props;
  if (!label) {
    return null;
  }

  const readonlyProperties = { ...label.properties };

  return (
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width={8}>
          <LabelInfoForm {...props} />
          <Divider horizontal hidden />
          <ReadonlyProperties properties={readonlyProperties} />
        </Grid.Column>
        <Grid.Column width={8}>
          <I18nForm label={label} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

DetailsTab.propTypes = {
  label: PropTypes.object,
};

DetailsTab.defaultProps = {
  label: null,
};

export default DetailsTab;
