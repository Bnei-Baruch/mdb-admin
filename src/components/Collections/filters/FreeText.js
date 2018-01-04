import React from 'react';
import PropTypes from 'prop-types';

import { NS_COLLECTIONS } from '../../../helpers/consts';
import TextFilter from '../../Filters/TextFilter';

const FreeText = props => (
  <TextFilter
    namespace={NS_COLLECTIONS}
    name="query"
    onApply={props.onFilterApplication}
  />
);

FreeText.propTypes = {
  onFilterApplication: PropTypes.func.isRequired
};

export default FreeText;

