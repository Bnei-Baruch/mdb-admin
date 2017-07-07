import { SECURITY_LEVELS } from '../../helpers/consts';
import { createFilterDefinition } from './util';

const secure = {
  name: 'secure',
  tagIcon: 'privacy',
  valueToQuery: value => SECURITY_LEVELS[value].text,
  queryToValue: (value) => {
    const sl = Array.from(Object.values(SECURITY_LEVELS)).find(x => x.text === value);
    if (sl) {
      return sl.value;
    }
    return null;
  },
  valueToTagLabel: value => SECURITY_LEVELS[value].text,
  valueToApiParam: value => ({ secure: value }),
};

export default createFilterDefinition(secure);
