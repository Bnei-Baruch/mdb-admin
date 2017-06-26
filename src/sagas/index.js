import { sagas as collections } from './collections';
import { sagas as contentUnits } from './content_units';
import { sagas as files } from './files';
import { sagas as search } from './search';
import { sagas as authors } from './authors';
import { sagas as sources } from './sources';
import { sagas as tags } from './tags';

export default [
  ...collections,
  ...contentUnits,
  ...files,
  ...search,
  ...authors,
  ...sources,
  ...tags,
];
