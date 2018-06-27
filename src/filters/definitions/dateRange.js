import moment from 'moment';

import { createFilterDefinition } from './util';

const dateRange = {
  name: 'date-range-filter',
  queryKey: 'dates',
  valueToQuery: (value) => {
    if (!value) {
      return null;
    }

    return `${moment.utc(value.from).format('YYYY-MM-DD')}_${moment.utc(value.to).format('YYYY-MM-DD')}`;
  },
  queryToValue: (queryValue) => {
    const parts = queryValue.split('_');

    return {
      from: moment.utc(parts[0], 'YYYY-MM-DD').toDate(),
      to: moment.utc(parts[1], 'YYYY-MM-DD').toDate()
    };
  },
  valueToApiParam: (value) => {
    const { from, to } = value;
    return {
      start_date: moment.utc(new Date(from)).format('YYYY-MM-DD'),
      end_date: moment.utc(new Date(to)).format('YYYY-MM-DD')
    };
  },
  tagIcon: 'calendar',
  valueToTagLabel: (value) => {
    if (!value) {
      return '';
    }

    const { from, to } = value;
    const dateFormat   = date => moment.utc(new Date(date)).format('D MMM YYYY');

    if (value.from === value.to) {
      return dateFormat(from);
    }

    return `${dateFormat(from)} - ${dateFormat(to)}`;
  }
};

export default createFilterDefinition(dateRange);
