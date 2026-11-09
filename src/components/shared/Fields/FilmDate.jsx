import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import { DateInput, Form } from '../../ui';

// value / onChange: 'yyyy-MM-dd' string (null when cleared)
const FilmDateField = (props) => {
  const { value = null, err = false, onChange = noop, ...rest } = props;

  return (
    <Form.Field error={err} {...rest}>
      <label htmlFor="film_date">Film Date</label>
      <DateInput id="film_date" value={value || ''} onChange={onChange} error={!!err} />
    </Form.Field>
  );
};

FilmDateField.propTypes = {
  value   : PropTypes.string,
  err     : PropTypes.bool,
  onChange: PropTypes.func,
};

export default FilmDateField;
