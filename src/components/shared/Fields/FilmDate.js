import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import noop from 'lodash/noop';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { Form } from 'semantic-ui-react';

import { DATE_FORMAT } from '../../../helpers/consts';

const FilmDateField = (props) => {
  const { value, err, onChange, ...rest } = props;

  const dayPickerProps = {
    firstDayOfWeek: 0,
  };

  return (
    <Form.Field error={err} {...rest}>
      <label htmlFor="film_date">Film Date</label>
      <DayPickerInput
        id="film_date"
        placeholder={DATE_FORMAT}
        format={DATE_FORMAT}
        value={value.format(DATE_FORMAT)}
        onDayChange={onChange}
        dayPickerProps={dayPickerProps}
        style={{ width: '100%', zIndex: 1000 }}
      />
    </Form.Field>
  );
};

FilmDateField.propTypes = {
  value: PropTypes.instanceOf(moment),
  err: PropTypes.bool,
  onChange: PropTypes.func,
};

FilmDateField.defaultProps = {
  value: moment(),
  err: false,
  onChange: noop,
};

export default FilmDateField;
