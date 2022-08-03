import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Form } from 'semantic-ui-react';

const LessonNumber = (props) => {
  const { value, err, onChange, ...rest } = props;

  return (
    <Form.Field error={err} {...rest}>
      <Form.Input
        label="Number"
        placeholder="Number"
        type="number"
        max={100}
        min={1}
        defaultValue={value}
        error={err}
        onChange={onChange}
      />
    </Form.Field>
  );
};

LessonNumber.propTypes = {
  value: PropTypes.number,
  err: PropTypes.bool,
  onChange: PropTypes.func,
};

LessonNumber.defaultProps = {
  err: false,
  onChange: noop,
};

export default LessonNumber;
