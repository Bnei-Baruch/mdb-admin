import { createFilterDefinition } from './util';

const contentType = {
  name: 'content_type',
  valueToQuery: (value) => value.join('.'),
  queryToValue: (queryValue) => queryValue.split('.')
};

export default createFilterDefinition(contentType);