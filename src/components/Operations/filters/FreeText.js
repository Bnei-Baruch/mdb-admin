import React from 'react';
import PropTypes from 'prop-types';

import { NS_OPERATIONS } from '../../../helpers/consts';
import TextFilter from '../../Filters/TextFilter';

const FreeText = props => (
  <TextFilter
    namespace={NS_OPERATIONS}
    name="query"
    onApply={props.onFilterApplication}
  />
);

FreeText.propTypes = {
  onFilterApplication: PropTypes.func.isRequired
};

export default FreeText;

