import React from 'react';
import PropTypes from 'prop-types';

import TextFilter from './TextFilter';

const FreeText = props => (
  <TextFilter
    namespace={props.namespace}
    name="query"
    onApply={props.onFilterApplication}
    isUpdateQuery={true}
  />
);

FreeText.propTypes = {
  onFilterApplication: PropTypes.func.isRequired,
  onFilterCancel: PropTypes.func.isRequired
};

export default FreeText;

