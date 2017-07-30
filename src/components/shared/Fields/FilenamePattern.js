import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Form, Input } from 'semantic-ui-react';

const FilenamePatternField = (props) => {
  const { value, err, onChange, ...rest } = props;

  return (
    <Form.Field error={err} {...rest}>
      <label htmlFor="pattern">Pattern</label>
      <Input
        id="pattern"
        placeholder="Pattern"
        value={value}
        onChange={onChange}
      />
      <small className="helper">
        Used in physical file names.
        English words separated with &lsquo;-&rsquo;
      </small>
    </Form.Field>
  );
};

FilenamePatternField.propTypes = {
  value: PropTypes.string,
  err: PropTypes.bool,
  onChange: PropTypes.func,
};

FilenamePatternField.defaultProps = {
  value: '',
  err: false,
  onChange: noop,
};

export default FilenamePatternField;
