import { createFilterDefinition } from './util';

const startDate = {
  name: 'start_date',
  valueToApiParam: value => ({ start_date: value })
};

export default createFilterDefinition(startDate);
