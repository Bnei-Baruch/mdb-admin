import React from 'react';
import PropTypes from 'prop-types';

import LanguageFilter from './LanguageFilter';

const OriginalLanguage = (props) => {
  const { namespace, onFilterApplication, isUpdateQuery } = props;
  return (
    <LanguageFilter
      namespace={namespace}
      onApply={onFilterApplication}
      isUpdateQuery={isUpdateQuery}
      name="original_language"
    />
  );
};

OriginalLanguage.propTypes = {
  onFilterApplication: PropTypes.func.isRequired,
  onFilterCancel: PropTypes.func.isRequired
};

export default OriginalLanguage;
