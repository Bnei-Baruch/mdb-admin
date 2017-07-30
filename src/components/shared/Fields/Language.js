import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Form } from 'semantic-ui-react';

import { LANG_HEBREW } from '../../../helpers/consts';
import { titleize } from '../../../helpers/utils';
import LanguageSelector from '../../shared/LanguageSelector';

const LanguageField = (props) => {
  const { name, value, err, onChange, ...rest } = props;

  return (
    <Form.Field error={err} {...rest}>
      <label htmlFor={name}>{titleize(name)}</label>
      <LanguageSelector
        selection
        id={name}
        value={value}
        onChange={onChange}
      />
    </Form.Field>
  );
};

LanguageField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  err: PropTypes.bool,
  onChange: PropTypes.func,
};

LanguageField.defaultProps = {
  value: LANG_HEBREW,
  err: false,
  onChange: noop,
};

export default LanguageField;
