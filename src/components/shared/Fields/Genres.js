import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Form } from 'semantic-ui-react';

import { EMPTY_ARRAY, GENRE_OPTIONS } from '../../../helpers/consts';

const GenresField = (props) => {
  const { value = EMPTY_ARRAY, err = false, onChange = noop, ...rest } = props;

  return (
    <Form.Field error={err} {...rest}>
      <Form.Dropdown
        fluid
        search
        selection
        required
        multiple
        label="Genre"
        placeholder="Genre"
        defaultValue={value}
        options={GENRE_OPTIONS}
        error={err}
        onChange={onChange}
      />
    </Form.Field>
  );
};

GenresField.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  err: PropTypes.bool,
  onChange: PropTypes.func,
};

export default GenresField;
