import { createFilterDefinition } from './util';

const contentType = {
  name: 'content_type',
  valueToQuery: value => value.join('.'),
  queryToValue: queryValue => queryValue.split('.'),
  valueToApiParam: value => ({ content_type: value })
};

export default createFilterDefinition(contentType);
