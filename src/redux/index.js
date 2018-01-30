import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { reducer as oidc } from 'redux-oidc';

import { reducer as user } from './modules/user';
import { reducer as filters } from './modules/filters';
import { reducer as lists } from './modules/lists';
import { reducer as search } from './modules/search';
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

export default combineReducers({
  router,
  oidc,
  system,
  user,
  filters,
  lists,
  search,
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
});

