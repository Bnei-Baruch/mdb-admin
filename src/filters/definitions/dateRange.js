import { formatUTC, parseUTC } from '../../helpers/date';

import { createFilterDefinition } from './util';

const toUTCDay = date => formatUTC(new Date(date), 'yyyy-MM-dd');

const dateRange = {
  name: 'date-range-filter',
  queryKey: 'dates',
  valueToQuery: value => {
    if (!value) {
      return null;
    }

    return `${toUTCDay(value.from)}_${toUTCDay(value.to)}`;
  },
  queryToValue: queryValue => {
    const parts = queryValue.split('_');

    // 'yyyy-MM-dd' -> Date at UTC midnight (same as moment.utc(str, 'YYYY-MM-DD').toDate())
    return {
      from: new Date(parseUTC(parts[0])),
      to: new Date(parseUTC(parts[1]))
    };
  },
  valueToApiParam: value => {
    const { from, to } = value;
    return {
      start_date: toUTCDay(from),
      end_date: toUTCDay(to)
    };
  },
  tagIcon: 'calendar',
  valueToTagLabel: value => {
    if (!value) {
      return '';
    }

    const { from, to } = value;
    const dateFormat   = date => formatUTC(new Date(date), 'd MMM yyyy');

    if (value.from === value.to) {
      return dateFormat(from);
    }

    return `${dateFormat(from)} - ${dateFormat(to)}`;
  }
};

export default createFilterDefinition(dateRange);
