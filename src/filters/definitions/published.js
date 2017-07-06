import { createFilterDefinition } from './util';

const published = {
  name: 'published',
  tagIcon: 'protect',
  valueToQuery: value => value.toString(),
  queryToValue: (value) => {
    switch (value) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return null;
    }
  },
  valueToTagLabel: value => (value ? 'Published' : 'Not Published'),
  valueToApiParam: value => ({ published: value }),
};

export default createFilterDefinition(published);
