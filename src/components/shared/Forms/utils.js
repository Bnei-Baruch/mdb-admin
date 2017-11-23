import moment from 'moment/moment';
import { DATE_FORMAT } from '../../../helpers/consts';

export const cleanProperties = properties =>
  Object.entries(properties).reduce((acc, val) => {
    const [k, v] = val;
    if (typeof v === 'string') {
      if (v.trim() !== '') {
        acc[k] = v.trim();
      }
    } else if (moment.isMoment(v)) {
      acc[k] = v.format(DATE_FORMAT);
    } else if (v !== null && typeof v !== 'undefined') {
      acc[k] = v;
    }
    return acc;
  }, {});

