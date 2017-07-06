import { sagas as collections } from './collections';
import { sagas as contentUnits } from './content_units';
import { sagas as files } from './files';
import { sagas as filters } from './filters';
import { sagas as lists } from './lists';
import { sagas as search } from './search';
import { sagas as operations } from './operations';
import { sagas as authors } from './authors';
import { sagas as sources } from './sources';
import { sagas as tags } from './tags';

export default [
  ...collections,
  ...contentUnits,
  ...files,
  ...filters,
  ...lists,
  ...search,
  ...operations,
  ...authors,
  ...sources,
  ...tags,
];
