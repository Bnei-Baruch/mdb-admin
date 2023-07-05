import { sagas as collections } from './collections';
import { sagas as contentUnits } from './content_units';
import { sagas as files } from './files';
import { sagas as filters } from './filters';
import { sagas as lists } from './lists';
import { sagas as operations } from './operations';
import { sagas as authors } from './authors';
import { sagas as sources } from './sources';
import { sagas as tags } from './tags';
import { sagas as persons } from './persons';
import { sagas as publishers } from './publishers';
import { sagas as search } from './search';
import { sagas as labels } from './labels';

export default [
  ...collections,
  ...contentUnits,
  ...files,
  ...filters,
  ...lists,
  ...operations,
  ...authors,
  ...sources,
  ...tags,
  ...persons,
  ...publishers,
  ...search,
  ...labels,
];
