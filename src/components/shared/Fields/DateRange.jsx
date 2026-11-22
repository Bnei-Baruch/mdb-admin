import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import { parseLocalDate, todayUTC } from '../../../helpers/date';
import { DateInput, Form } from '../../ui';

// start / end and onChange({ start, end }): 'yyyy-MM-dd' strings (null when cleared)
class DateRangeField extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      start: props.start || null,
      end  : props.end || null,
    };
  }

  handleStartChange = start =>
    this.setState({ start }, () => this.props.onChange(this.state));

  handleEndChange = end =>
    this.setState({ end }, () => this.props.onChange(this.state));

  render() {
    const { err }        = this.props;
    const { start, end } = this.state;
    const startDate      = parseLocalDate(start);
    const endDate        = parseLocalDate(end);

    return (
      <Form.Group widths="equal">
        <Form.Field required error={err.start}>
          <label htmlFor="start_date">Start Date</label>
          <DateInput
            id="start_date"
            value={start || ''}
            onChange={this.handleStartChange}
            disabled={endDate ? { after: endDate } : undefined}
            error={!!err.start}
          />
        </Form.Field>
        <Form.Field required error={err.end}>
          <label htmlFor="end_date">End Date</label>
          <DateInput
            id="end_date"
            value={end || ''}
            onChange={this.handleEndChange}
            disabled={startDate ? { before: startDate } : undefined}
            error={!!err.end}
          />
        </Form.Field>
      </Form.Group>
    );
  }
}

DateRangeField.propTypes = {
  start   : PropTypes.string,
  end     : PropTypes.string,
  err     : PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      start: PropTypes.bool,
      end  : PropTypes.bool,
    }),
  ]),
  onChange: PropTypes.func,
};

DateRangeField.defaultProps = {
  start   : todayUTC(),
  end     : todayUTC(1),
  err     : false,
  onChange: noop,
};

export default DateRangeField;
