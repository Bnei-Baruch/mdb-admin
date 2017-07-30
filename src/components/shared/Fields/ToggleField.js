import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Checkbox, Form } from 'semantic-ui-react';

import { titleize } from '../../../helpers/utils';

const ToggleField = (props) => {
  const { name, value, err, onChange, ...rest } = props;

  return (
    <Form.Field error={err} {...rest}>
      <label htmlFor={name}>{titleize(name)}</label>
      <Checkbox
        toggle
        id={name}
        checked={value}
        onChange={onChange}
      />
    </Form.Field>
  );
};

ToggleField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.bool,
  err: PropTypes.bool,
  onChange: PropTypes.func,
};

ToggleField.defaultProps = {
  value: true,
  err: false,
  onChange: noop,
};

export default ToggleField;
