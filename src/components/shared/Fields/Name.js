import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Flag, Form, Input } from 'semantic-ui-react';

import { LANGUAGES } from '../../../helpers/consts';

const NameField = (props) => {
  const { value, language, err, onChange, ...rest } = props;
  const langData                                    = LANGUAGES[language];

  return (
    <Form.Field error={err} {...rest}>
      <label htmlFor={`${language}.name`}>
        <Flag name={langData.flag} />
        {langData.text}
      </label>
      <Input
        id={`${language}.name`}
        placeholder={`Name in ${langData.text}`}
        value={value}
        onChange={onChange}
      />
    </Form.Field>
  );
};

NameField.propTypes = {
  language: PropTypes.string.isRequired,
  value: PropTypes.string,
  err: PropTypes.bool,
  onChange: PropTypes.func,
};

NameField.defaultProps = {
  language: '',
  value: '',
  err: false,
  onChange: noop,
};

export default NameField;
