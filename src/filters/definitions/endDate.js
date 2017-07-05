import { createFilterDefinition } from './util';

const endDate = {
  name: 'end_date',
  valueToApiParam: value => ({ end_date: value })
};

export default createFilterDefinition(endDate);
