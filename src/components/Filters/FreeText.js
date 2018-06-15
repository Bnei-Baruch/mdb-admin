import React from 'react';
import PropTypes from 'prop-types';

import TextFilter from './TextFilter';

const FreeText = props => {

  const { namespace, onFilterApplication, isUpdateQuery } = props;
  return (
    <TextFilter
      namespace={namespace}
      name="query"
      onApply={onFilterApplication}
      isUpdateQuery={isUpdateQuery}
    />
  );
};

FreeText.propTypes = {
  onFilterApplication: PropTypes.func.isRequired,
  onFilterCancel: PropTypes.func.isRequired
};

export default FreeText;

