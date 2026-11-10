import { formatLocalDate } from '../../../helpers/date';

export const cleanProperties = properties =>
  Object.entries(properties).reduce((acc, val) => {
    const [k, v] = val;
    if (typeof v === 'string') {
      if (v.trim() !== '') {
        acc[k] = v.trim();
      }
    } else if (v instanceof Date) {
      // date fields are kept as 'yyyy-MM-dd' strings; guard against a stray Date
      acc[k] = formatLocalDate(v);
    } else if (v !== null && typeof v !== 'undefined') {
      acc[k] = v;
    }

    return acc;
  }, {});
