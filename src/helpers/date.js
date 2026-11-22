// Date helpers on top of date-fns (replacement for moment).
import { addMinutes, format, isValid, parse } from 'date-fns';
import { UTCDate } from '@date-fns/utc';

/** Format used for dates sent to / received from the API and typed by users. */
export const DATE_FNS_FORMAT = 'yyyy-MM-dd';

const HAS_TZ    = /([zZ]|[+-]\d\d:?\d\d)$/;
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parse an API value as a UTC instant (like `moment.utc(value)`).
 * Strings without a timezone designator are treated as UTC, not local time.
 */
export const parseUTC = value => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (value instanceof Date) {
    return new UTCDate(value.getTime());
  }

  if (typeof value === 'number') {
    return new UTCDate(value);
  }

  const s = String(value).trim();
  let d;
  if (DATE_ONLY.test(s) || HAS_TZ.test(s)) {
    d = new Date(s); // date-only ISO strings are parsed as UTC by spec
  } else {
    d = new Date(`${s.replace(' ', 'T')}Z`);
  }

  return isValid(d) ? new UTCDate(d.getTime()) : null;
};

/** Format an API value in UTC (like `moment.utc(value).format(...)`). Returns '' for empty/invalid. */
export const formatUTC = (value, pattern = 'yyyy-MM-dd HH:mm:ss') => {
  const d = parseUTC(value);
  return d ? format(d, pattern) : '';
};

/** 'yyyy-MM-dd' of an API value in UTC, or null. */
export const toDateString = value => {
  const d = parseUTC(value);
  return d ? format(d, DATE_FNS_FORMAT) : null;
};

/** Today's date in UTC as 'yyyy-MM-dd' (like `moment.utc().format('YYYY-MM-DD')`). */
export const todayUTC = (plusDays = 0) => {
  const d = new UTCDate();
  d.setUTCDate(d.getUTCDate() + plusDays);
  return format(d, DATE_FNS_FORMAT);
};

/** Seconds -> 'HH:mm:ss' (wraps at 24h, same as moment.utc(duration).format('HH:mm:ss')). */
export const formatDuration = seconds => {
  const total = Math.floor(Number(seconds) || 0) % 86400;
  const h     = Math.floor(total / 3600);
  const m     = Math.floor((total % 3600) / 60);
  const s     = total % 60;
  return [h, m, s].map(x => String(x).padStart(2, '0')).join(':');
};

/** Strictly parse a user-typed 'yyyy-MM-dd' into a local Date, or null. */
export const parseLocalDate = str => {
  if (!str || !DATE_ONLY.test(str.trim())) {
    return null;
  }

  const d = parse(str.trim(), DATE_FNS_FORMAT, new Date());
  return isValid(d) ? d : null;
};

/** Local Date -> 'yyyy-MM-dd' (calendar date as the user sees it). */
export const formatLocalDate = d => (d && isValid(d) ? format(d, DATE_FNS_FORMAT) : '');

/**
 * Shift a local calendar date so that its UTC representation has the same
 * calendar day (what the date filter did with moment's utcOffset()).
 */
export const localDayAsUTC = d => addMinutes(d, -d.getTimezoneOffset());
