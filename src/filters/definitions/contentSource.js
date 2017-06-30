import { createFilterDefinition } from './util';

const contentSource = {
  name: 'content_source',
  valueToQuery: (value) => value.join('.'),
  queryToValue: (queryValue) => queryValue.split('.')
};

export default createFilterDefinition(contentSource);