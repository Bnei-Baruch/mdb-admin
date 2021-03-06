import React from 'react';
import { Divider, Grid } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import ReadonlyProperties from '../../../shared/Properties';
import Details from './Details';
import PropertiesForm from './Properties';
import I18nForm from './I18nForm';
import {
  CONTENT_TYPE_BY_ID,
  CT_SOURCE,
  CT_LIKUTIM,
  CT_CLIP,
  CT_VIDEO_PROGRAM_CHAPTER, CT_LECTURE
} from '../../../../helpers/consts';

const editableProperties = ['film_date', 'original_language'];

const DetailsTab = (props) => {
  const { unit } = props;
  if (!unit) {
    return null;
  }

  if (CONTENT_TYPE_BY_ID[unit.type_id] === CT_LIKUTIM ||
    CONTENT_TYPE_BY_ID[unit.type_id] === CT_CLIP ||
    CONTENT_TYPE_BY_ID[unit.type_id] === CT_VIDEO_PROGRAM_CHAPTER ||
    CONTENT_TYPE_BY_ID[unit.type_id] === CT_LECTURE) {
    editableProperties.push('pattern');
  }

  const readonlyProperties = { ...unit.properties };
  editableProperties.forEach(x => (delete readonlyProperties[x]));

  return (
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width={8}>
          <Details unit={unit} />
          <Divider horizontal hidden />
          <PropertiesForm unit={unit} />
          <Divider horizontal hidden />
          <ReadonlyProperties properties={readonlyProperties} />
        </Grid.Column>
        <Grid.Column width={8}>
          <I18nForm unit={unit} disabled={CONTENT_TYPE_BY_ID[unit.type_id] === CT_SOURCE} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

DetailsTab.propTypes = {
  unit: shapes.ContentUnit,
};

DetailsTab.defaultProps = {
  unit: null,
};

export default DetailsTab;
