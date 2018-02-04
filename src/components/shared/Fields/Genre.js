import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Form } from 'semantic-ui-react';

import { GENRE_OPTIONS } from '../../../helpers/consts';

const GenreField = (props) => {
  const { value, err, onChange, ...rest } = props;

  return (
    <Form.Field error={err} {...rest}>
      <Form.Dropdown
        fluid
        search
        selection
        required
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

GenreField.propTypes = {
  value: PropTypes.string,
  err: PropTypes.bool,
  onChange: PropTypes.func,
};

GenreField.defaultProps = {
  value: '',
  err: false,
  onChange: noop,
};

export default GenreField;
