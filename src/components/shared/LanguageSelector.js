import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

import { ALL_LANGUAGES, LANG_MULTI, LANG_UNKNOWN, LANGUAGE_OPTIONS } from '../../helpers/consts';

const LanguageSelector = (props) => {
  const { include = ALL_LANGUAGES, exclude = [LANG_MULTI, LANG_UNKNOWN], ...rest } = props;

  const options = LANGUAGE_OPTIONS
    .filter(x => include.includes(x.value) && !exclude.includes(x.value));

  return <Dropdown {...rest} options={options} selectOnBlur={false} />;
};

LanguageSelector.propTypes = {
  include: PropTypes.arrayOf(PropTypes.string),
  exclude: PropTypes.arrayOf(PropTypes.string),
};

export default LanguageSelector;
