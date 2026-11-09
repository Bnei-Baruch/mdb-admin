import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import {
  endOfMonth, isAfter, isSameDay, isValid, startOfMonth, subDays, subMonths,
} from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';

import { formatLocalDate, localDayAsUTC, parseLocalDate } from '../../helpers/date';
import { Button, Divider, Dropdown, Grid, Header, Input, Segment } from '../ui';
import { DAY_PICKER_STYLE } from '../ui/DateInput';
import connectFilter from './connectFilter';

// TODO (yaniv -> oleg): need indication for user when clicking on a bad date (after today) or when typing bad dates

const now = () => {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  return d;
};

const TODAY        = 1;
const YESTERDAY    = 2;
const LAST_7_DAYS  = 3;
const LAST_30_DAYS = 4;
const LAST_MONTH   = 5;
const THIS_MONTH   = 6;
const CUSTOM_RANGE = 100;

const datePresets = {
  TODAY       : { key: 1, text: 'Today', value: TODAY },
  YESTERDAY   : { key: 2, text: 'Yesterday', value: YESTERDAY },
  LAST_7_DAYS : { key: 3, text: 'Last 7 Days', value: LAST_7_DAYS },
  LAST_30_DAYS: { key: 4, text: 'Last 30 Days', value: LAST_30_DAYS },
  LAST_MONTH  : { key: 5, text: 'Last Month', value: LAST_MONTH },
  THIS_MONTH  : { key: 6, text: 'This Month', value: THIS_MONTH },
  CUSTOM_RANGE: { key: 7, text: 'Custom Range', value: CUSTOM_RANGE },
};

const datePresetsOptions = Object.keys(datePresets).map(key => datePresets[key]);

const presetToRange = {
  [TODAY]       : () => {
    const today = new Date();
    return ({ from: today, to: today });
  },
  [YESTERDAY]   : () => {
    const yesterday = subDays(new Date(), 1);
    return ({ from: yesterday, to: yesterday });
  },
  [LAST_7_DAYS] : () => ({
    from: subDays(new Date(), 6),
    to  : new Date()
  }),
  [LAST_30_DAYS]: () => ({
    from: subDays(new Date(), 30),
    to  : new Date()
  }),
  [LAST_MONTH]  : () => {
    const prevMonth = subMonths(new Date(), 1);
    return ({
      from: startOfMonth(prevMonth),
      to  : endOfMonth(prevMonth)
    });
  },
  [THIS_MONTH]  : () => ({
    from: startOfMonth(new Date()),
    to  : new Date()
  })
};

const rangeToPreset = (from, to) => {
  if (!from || !to) {
    return CUSTOM_RANGE;
  }
  const today = new Date();
  if (isSameDay(from, to)) {
    if (isSameDay(to, today)) {
      return TODAY;
    }
    if (isSameDay(to, subDays(today, 1))) {
      return YESTERDAY;
    }
  } else if (isSameDay(subDays(to, 6), from)) {
    return LAST_7_DAYS;
  } else if (isSameDay(subDays(to, 30), from) && isSameDay(to, today)) {
    return LAST_30_DAYS;
  } else if (isSameDay(startOfMonth(today), from) && isSameDay(today, to)) {
    return THIS_MONTH;
  }

  const prevMonth = subMonths(today, 1);
  if (isSameDay(startOfMonth(prevMonth), from) && isSameDay(endOfMonth(prevMonth), to)) {
    return LAST_MONTH;
  }

  return CUSTOM_RANGE;
};

const isValidDateRange = (fromValue, toValue) => {
  const from = parseLocalDate(fromValue);
  const to   = parseLocalDate(toValue);

  return !!from && !!to && !isAfter(from, to) && !isAfter(to, now());
};

const toDate = v => {
  const d = v instanceof Date ? v : new Date(v);
  return isValid(d) ? d : null;
};

class DateFilter extends Component {
  static propTypes = {
    value        : PropTypes.shape({
      from      : PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
      to        : PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
      datePreset: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    }),
    onCancel     : PropTypes.func,
    onApply      : PropTypes.func,
    updateValue  : PropTypes.func.isRequired,
    isUpdateQuery: PropTypes.bool,
  };

  static defaultProps = {
    onCancel     : noop,
    onApply      : noop,
    isUpdateQuery: false,
    value        : {
      datePreset: TODAY,
      ...presetToRange[TODAY]()
    }
  };

  constructor(props) {
    super(props);
    const from = toDate(props.value.from);
    const to   = toDate(props.value.to);
    this.state = {
      from,
      to,
      month         : from || new Date(),
      fromInputValue: formatLocalDate(from),
      toInputValue  : formatLocalDate(to),
      datePreset    : rangeToPreset(from, to),
    };
  }

  setRange(datePreset, from, to, fromInputValue = '', toInputValue = '') {
    let range = {};
    if (datePreset === CUSTOM_RANGE) {
      range.from = from || this.state.from;
      range.to   = to || this.state.to;
    } else {
      range = (presetToRange[datePreset] ? presetToRange[datePreset] : presetToRange[TODAY])();
    }

    this.setState({
      ...range,
      datePreset,
      // try to show the entire range in the calendar
      month         : range.from || this.state.month,
      fromInputValue: fromInputValue || formatLocalDate(range.from),
      toInputValue  : toInputValue || formatLocalDate(range.to),
    });
  }

  apply = () => {
    // Keep the calendar day the user picked when the value is later formatted in UTC.
    const from = localDayAsUTC(this.state.from);
    const to   = localDayAsUTC(this.state.to);

    this.props.updateValue({ from, to, datePreset: this.state.datePreset }, this.props.isUpdateQuery);
    this.props.onApply();
  };

  handleRangeSelect = (range) => {
    this.setRange(CUSTOM_RANGE, range?.from || null, range?.to || range?.from || null);
  };

  handleDatePresetsChange = (event, data) => this.setRange(data.value);

  handleFromInputChange = (event) => {
    const { value } = event.target;
    const date      = parseLocalDate(value);

    if (date && isValidDateRange(value, this.state.toInputValue)) {
      this.setRange(CUSTOM_RANGE, date, parseLocalDate(this.state.toInputValue), value, this.state.toInputValue);
    } else {
      this.setState({ fromInputValue: value });
    }
  };

  handleToInputChange = (event) => {
    const { value } = event.target;
    const date      = parseLocalDate(value);

    if (date && isValidDateRange(this.state.fromInputValue, value)) {
      this.setRange(CUSTOM_RANGE, parseLocalDate(this.state.fromInputValue), date, this.state.fromInputValue, value);
    } else {
      this.setState({ toInputValue: value });
    }
  };

  canApply = () => isValidDateRange(this.state.fromInputValue, this.state.toInputValue);

  render() {
    const { onCancel } = this.props;

    const {
      fromInputValue, toInputValue, from, to, datePreset, month
    } = this.state;

    return (
      <Segment basic compact attached="bottom" floated="left" className="tab active">
        <Grid divided>
          <Grid.Row>
            <div className="px-3 py-2">
              <DayPicker
                mode="range"
                numberOfMonths={2}
                style={DAY_PICKER_STYLE}
                selected={{ from, to }}
                onSelect={this.handleRangeSelect}
                month={month}
                onMonthChange={m => this.setState({ month: m })}
                endMonth={now()}
                disabled={{ after: now() }}
              />
            </div>
            <div className="px-3 py-2">
              <Header textAlign="center">Select a start index</Header>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <Dropdown
                      fluid
                      item
                      value={datePreset}
                      options={datePresetsOptions}
                      onChange={this.handleDatePresetsChange}
                      selectOnBlur={false}
                    />
                    <Divider />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={8}>
                    <Input
                      value={fromInputValue}
                      onChange={this.handleFromInputChange}
                      fluid
                      placeholder="YYYY-MM-DD"
                    />
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <Input
                      value={toInputValue}
                      onChange={this.handleToInputChange}
                      fluid
                      placeholder="YYYY-MM-DD"
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column textAlign="right">
                    <Button type="button" onClick={onCancel}>Cancel</Button>
                    <Button type="button" primary disabled={!this.canApply()} onClick={this.apply} className="ml-2">Apply</Button>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

export default connectFilter()(DateFilter);
