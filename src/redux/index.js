import { combineReducers } from 'redux';
import  { createRouterReducer as connectRouter  } from '@lagunovsky/redux-react-router';

import { reducer as user } from './modules/user';
import { reducer as filters } from './modules/filters';
import { reducer as lists } from './modules/lists';
import { reducer as system } from './modules/system';
import { reducer as collections } from './modules/collections';
import { reducer as content_units } from './modules/content_units';
import { reducer as files } from './modules/files';
import { reducer as operations } from './modules/operations';
import { reducer as authors } from './modules/authors';
import { reducer as sources } from './modules/sources';
import { reducer as tags } from './modules/tags';
import { reducer as storages } from './modules/storages';
import { reducer as persons } from './modules/persons';
import { reducer as publishers } from './modules/publishers';
import { reducer as search } from './modules/search';
import { reducer as labels } from './modules/labels';

export default history => combineReducers({
  router: connectRouter(history),
  system,
  user,
  filters,
  lists,
  collections,
  content_units,
  files,
  operations,
  authors,
  sources,
  tags,
  storages,
  persons,
  publishers,
  search,
  labels,
});
