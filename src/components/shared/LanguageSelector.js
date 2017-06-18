import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

import { ALL_LANGUAGES, LANG_HEBREW, LANG_MULTI, LANG_UNKNOWN, LANGUAGE_OPTIONS } from '../../helpers/consts';

const LanguageSelector = (props) => {
  const { isSelection, defaultValue, text, include, exclude, onSelect } = props;

  const dProps = {
    item: true,
    labeled: true,
    scrolling: true,
    defaultValue,
    options: LANGUAGE_OPTIONS.filter(x => include.includes(x.value) && !exclude.includes(x.value)),
    onChange: (e, { value }) => onSelect(value)
  };

  if (isSelection) {
    dProps.selection = true;
  } else {
    dProps.text = text;
  }

  return <Dropdown {...dProps} />;
};

LanguageSelector.propTypes = {
  onSelect: PropTypes.func.isRequired,
  isSelection: PropTypes.bool,
  defaultValue: PropTypes.string,
  text: PropTypes.string,
  include: PropTypes.arrayOf(PropTypes.string),
  exclude: PropTypes.arrayOf(PropTypes.string),
};

LanguageSelector.defaultProps = {
  isSelection: false,
  defaultValue: LANG_HEBREW,
  text: 'Add Language',
  include: ALL_LANGUAGES,
  exclude: [LANG_MULTI, LANG_UNKNOWN],
};

export default LanguageSelector;
