import { createFilterDefinition } from './util';

const originalLanguage = {
  name: 'original_language',
  valueToApiParam: value => ({ original_language: value }),
  valueToQuery: value => value,
  queryToValue: queryValue => queryValue,
  valueToTagLabel: value => `Original language: ${value}`,
};

export default createFilterDefinition(originalLanguage);
