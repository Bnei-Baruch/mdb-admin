import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { reducer as filters } from './modules/filters';
import { reducer as search } from './modules/search';
import { reducer as system } from './modules/system';
import { reducer as collections } from './modules/collections';
import { reducer as content_units } from './modules/content_units';
import { reducer as files } from './modules/files';
import { reducer as authors } from './modules/authors';
import { reducer as sources } from './modules/sources';
import { reducer as tags } from './modules/tags';

export default combineReducers({
  router,
  system,
  filters,
  search,
  collections,
  content_units,
  files,
  authors,
  sources,
  tags,
});

