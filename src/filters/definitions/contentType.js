import { createFilterDefinition } from './util';

const contentType = {
  name: 'content_type',
  valueToApiParam: value => ({ content_type: value }),
};

export default createFilterDefinition(contentType);
