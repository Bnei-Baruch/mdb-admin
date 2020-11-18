import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import noop from 'lodash/noop';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { formatDate, parseDate, } from 'react-day-picker/moment';
import { Form } from 'semantic-ui-react';

import { DATE_FORMAT } from '../../../helpers/consts';

class DateRangeField extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      start: props.start,
      end: props.end,
    };
  }

  handleStartChange = start =>
    this.setState({ start }, () => this.props.onChange(this.state));

  handleEndChange = end =>
    this.setState({ end }, () => this.props.onChange(this.state));

  render() {
    const { start, end, err } = this.props;

    const dayPickerStartProps = {
      firstDayOfWeek: 0,
      disabledDays: {
        after: moment(end).toDate(),
      },
    };

    const dayPickerEndProps = {
      firstDayOfWeek: 0,
      disabledDays: {
        before: moment(start).toDate(),
      },
    };

    return (
      <Form.Group widths="equal">
        <Form.Field required error={err.start}>
          <label htmlFor="start_date">Start Date</label>
          <DayPickerInput
            id="start_date"
            placeholder={DATE_FORMAT}
            formatDate={formatDate}
            parseDate={parseDate}
            format={DATE_FORMAT}
            value={start.format(DATE_FORMAT)}
            onDayChange={this.handleStartChange}
            dayPickerProps={dayPickerStartProps}
            style={{ width: '100%', zIndex: 1000 }}
          />
        </Form.Field>
        <Form.Field required error={err.end}>
          <label htmlFor="end_date">End Date</label>
          <DayPickerInput
            id="end_date"
            placeholder={DATE_FORMAT}
            formatDate={formatDate}
            parseDate={parseDate}
            format={DATE_FORMAT}
            value={end.format(DATE_FORMAT)}
            onDayChange={this.handleEndChange}
            dayPickerProps={dayPickerEndProps}
            style={{ width: '100%', zIndex: 1000 }}
          />
        </Form.Field>
      </Form.Group>
    );
  }
}

DateRangeField.propTypes = {
  start: PropTypes.instanceOf(moment),
  end: PropTypes.instanceOf(moment),
  err: PropTypes.shape({
    start: PropTypes.bool,
    end: PropTypes.bool,
  }),
  onChange: PropTypes.func,
};

DateRangeField.defaultProps = {
  start: moment(),
  end: moment().add(1, 'days'),
  err: false,
  onChange: noop,
};

export default DateRangeField;
