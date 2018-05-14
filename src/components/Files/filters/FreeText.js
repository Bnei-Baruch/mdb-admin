import React from 'react';
import PropTypes from 'prop-types';

import { NS_FILES } from '../../../helpers/consts';
import TextFilter from '../../Filters/TextFilter';

const FreeText = props => (
  <TextFilter
    namespace={NS_FILES}
    name="query"
    onApply={props.onFilterApplication}
    isUpdateQuery={true}
  />
);

FreeText.propTypes = {
  onFilterApplication: PropTypes.func.isRequired
};

export default FreeText;

