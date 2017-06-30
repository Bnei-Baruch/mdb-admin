import { createFilterDefinition } from './util';

const contentSource = {
  name: 'content_source',
  valueToQuery: (value) => value.join('.'),
  queryToValue: (queryValue) => queryValue.split('.'),
  valueToApiParam: (value) => ({ content_source: value })
};

export default createFilterDefinition(contentSource);