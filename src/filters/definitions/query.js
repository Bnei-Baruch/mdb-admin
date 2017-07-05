import { createFilterDefinition } from './util';

const query = {
  name: 'query',
  valueToApiParam: (value) => ({ query: value })
};

export default createFilterDefinition(query);