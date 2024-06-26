import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import noop from 'lodash/noop';
import DayPicker, { DateUtils } from 'react-day-picker';
import { Button, Divider, Dropdown, Grid, Header, Input, Segment } from 'semantic-ui-react';

import 'react-day-picker/lib/style.css';
import connectFilter from './connectFilter';

// TODO (yaniv -> oleg): need indication for user when clicking on a bad date (after today) or when typing bad dates

const format     = 'YYYY-MM-DD';
const UTC_OFFSET = moment().utcOffset();

const now = () =>
  moment(new Date())
    .hours(12)
    .minutes(0)
    .seconds(0)
    .milliseconds(0)
    .toDate();

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
    const today = moment().toDate();
    return ({ from: today, to: today });
  },
  [YESTERDAY]   : () => {
    const yesterday = moment().subtract(1, 'days').toDate();
    return ({ from: yesterday, to: yesterday });
  },
  [LAST_7_DAYS] : () => ({
    from: moment().subtract(6, 'days').toDate(),
    to  : moment().toDate()
  }),
  [LAST_30_DAYS]: () => ({
    from: moment().subtract(30, 'days').toDate(),
    to  : moment().toDate()
  }),
  [LAST_MONTH]  : () => {
    const todayMinusMonthMoment = moment().subtract(1, 'months');
    return ({
      from: todayMinusMonthMoment.startOf('month').toDate(),
      to  : todayMinusMonthMoment.endOf('month').toDate()
    });
  },
  [THIS_MONTH]  : () => ({
    from: moment().startOf('month').toDate(),
    to  : moment().toDate()
  })
};

const rangeToPreset = (from, to) => {
  if (moment(from, 'day').isSame(to, 'day')) {
    if (moment(to).isSame(now(), 'day')) {
      return TODAY;
    }
    if (moment(to).isSame(moment().subtract(1, 'days'), 'days')) {
      return YESTERDAY;
    }
  } else if (moment(to).subtract(6, 'days').isSame(from, 'day')) {
    return LAST_7_DAYS;
  } else if (moment(to).subtract(30, 'days').isSame(from, 'day') && moment(to).isSame(moment(), 'day')) {
    return LAST_30_DAYS;
  } else if (moment().startOf('month').isSame(from, 'day') && moment().isSame(to, 'day')) {
    return THIS_MONTH;
  }

  const todayMinusMonthMoment = moment().subtract(1, 'months');
  if (todayMinusMonthMoment.startOf('month').isSame(from, 'day') && todayMinusMonthMoment.endOf('month').isSame(to, 'day')) {
    return LAST_MONTH;
  }

  return CUSTOM_RANGE;
};

const isValidDateRange = (fromValue, toValue) => {
  const fromMoment = moment(fromValue, format, true);
  const toMoment   = moment(toValue, format, true);

  return fromMoment.isValid()
    && toMoment.isValid()
    && fromMoment.isSameOrBefore(toMoment)
    && toMoment.isSameOrBefore(now());
};

class DateFilter extends Component {
  static propTypes = {
    value      : PropTypes.shape({
      from      : PropTypes.objectOf(Date),
      to        : PropTypes.objectOf(Date),
      datePreset: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    }),
    onCancel   : PropTypes.func,
    onApply    : PropTypes.func,
    updateValue: PropTypes.func.isRequired
  };

  static defaultProps = {
    onCancel: noop,
    onApply : noop,
    value   : {
      datePreset: TODAY,
      ...presetToRange[TODAY]()
    }
  };

  constructor(props, context) {
    super(props, context);
    this.state = this.getUpdatedStateFromValue(this.props.value, {});
  }

  componentDidMount() {
    this.datePicker.showMonth(this.state.from);
  }

  getUpdatedStateFromValue = (newVal, prevVal) => {
    const result                   = {};
    const { from: nFrom, to: nTo } = newVal;
    const { from, to }             = prevVal;

    if (nFrom !== from) {
      result.from           = nFrom;
      result.fromInputValue = moment(nFrom, 'YYYY-MM-DD').format('YYYY-MM-DD');
    }

    if (nTo !== to) {
      result.to           = nTo;
      result.toInputValue = moment(nTo, 'YYYY-MM-DD').format('YYYY-MM-DD');
    }

    if (nFrom !== from || nTo !== to) {
      result.datePreset = rangeToPreset(nFrom, nTo);
    }

    return (Object.keys(result).length !== 0) ? result : null;
  };

  setRange(datePreset, from, to, fromInputValue = '', toInputValue = '') {
    let range = {};
    if (datePreset === CUSTOM_RANGE) {
      range.from = from || this.state.from;
      range.to   = to || this.state.to;
    } else {
      range = (presetToRange[datePreset] ? presetToRange[datePreset] : presetToRange[TODAY])();
    }

    // try to show entire range in calendar
    if (datePreset !== CUSTOM_RANGE || (datePreset === CUSTOM_RANGE && range && range.from)) {
      this.datePicker.showMonth(range.from);
    }

    const momentFrom = moment(new Date(range.from));
    const momentTo   = moment(new Date(range.to));

    this.setState({
      ...range,
      datePreset,
      fromInputValue: fromInputValue || (momentFrom.isValid() ? momentFrom.format(format) : ''),
      toInputValue  : toInputValue || (momentTo.isValid() ? momentTo.format(format) : '')
    });
  }

  apply = () => {
    const from = moment(this.state.from).add(UTC_OFFSET, 'm').toDate();
    const to   = moment(this.state.to).add(UTC_OFFSET, 'm').toDate();

    this.props.updateValue({ from, to, datePreset: this.state.datePreset }, this.props.isUpdateQuery);
    this.props.onApply();
  };

  handleDayClick = (day) => {
    if (moment(day).isAfter(now())) {
      return;
    }

    const { from, to } = this.state;
    const range        = DateUtils.addDayToRange(day, { from, to });

    this.setRange(CUSTOM_RANGE, range.from, range.to);
  };

  handleDatePresetsChange = (event, data) => this.setRange(data.value);

  handleFromInputChange = (event) => {
    const { value }   = event.target;
    const momentValue = moment(value, format, true);

    const isValid = momentValue.isValid();
    if (isValid && isValidDateRange(value, this.state.toInputValue)) {
      this.setRange(
        CUSTOM_RANGE,
        momentValue.toDate(),
        moment(this.state.toInputValue, format, true).toDate(),
        value,
        this.state.toInputValue
      );
    } else {
      this.setState({
        fromInputValue: value
      });
    }
  };

  handleToInputChange = (event) => {
    const { value }   = event.target;
    const momentValue = moment(value, format, true);

    const isValid = momentValue.isValid();
    if (isValid && isValidDateRange(this.state.fromInputValue, value)) {
      this.setRange(
        CUSTOM_RANGE,
        moment(this.state.fromInputValue, format, true).toDate(),
        momentValue.toDate(),
        this.state.fromInputValue,
        value
      );
    } else {
      this.setState({
        toInputValue: value
      });
    }
  };

  canApply = () => isValidDateRange(this.state.fromInputValue, this.state.toInputValue);

  render() {
    const { onCancel } = this.props;

    const {
            fromInputValue, toInputValue, from, to, datePreset
          } = this.state;

    return (
      <Segment basic compact attached="bottom" floated="left" className="tab active">
        <Grid divided>
          <Grid.Row>
            <div>
              <DayPicker
                numberOfMonths={2}
                selectedDays={{ from, to }}
                onDayClick={this.handleDayClick}
                toMonth={now()}
                // eslint-disable-next-line no-return-assign
                ref={el => this.datePicker = el}
              />
            </div>
            <div>
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
                    <Button type="button" primary disabled={!this.canApply()} onClick={this.apply}>Apply</Button>
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
