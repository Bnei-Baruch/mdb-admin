import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import memoize from 'lodash/memoize';

import { setMap } from '../utils';
import { types as sources } from './sources';

/* Types */

const FETCH_ALL         = 'Authors/FETCH_ALL';
const FETCH_ALL_SUCCESS = 'Authors/FETCH_ALL_SUCCESS';
const FETCH_ALL_FAILURE = 'Authors/FETCH_ALL_FAILURE';

export const types = {
  FETCH_ALL,
  FETCH_ALL_SUCCESS,
  FETCH_ALL_FAILURE,
};

/* Actions */

const fetchAll        = createAction(FETCH_ALL);
const fetchAllSuccess = createAction(FETCH_ALL_SUCCESS);
const fetchAllFailure = createAction(FETCH_ALL_FAILURE);

export const actions = {
  fetchAll,
  fetchAllSuccess,
  fetchAllFailure,
};

/* Reducer */

const keys = new Map([
  [FETCH_ALL, 'fetchAuthors'],
  [FETCH_ALL_SUCCESS, 'fetchAuthors'],
  [FETCH_ALL_FAILURE, 'fetchAuthors'],
]);

const initialState = {
  byID: new Map(),
  wip: new Map(Array.from(keys.values(), x => [x, false])),
  errors: new Map(Array.from(keys.values(), x => [x, null])),
};

const onRequest = (state, action) => ({
  ...state,
  wip: setMap(state.wip, keys.get(action.type), true)
});

const onFailure = (state, action) => {
  const key = keys.get(action.type);
  return {
    ...state,
    wip: setMap(state.wip, key, false),
    errors: setMap(state.errors, key, action.payload),
  };
};

const onSuccess = (state, action) => {
  const key = keys.get(action.type);

  let byID;
  switch (action.type) {
  case FETCH_ALL_SUCCESS:
    byID = new Map(action.payload.data.map(x =>
      [
        x.id,
        {
          ...x,
          sources: x.sources.map(y => y.id)
        }
      ]));
    break;
  default:
    byID = state.byID;
  }

  return {
    ...state,
    byID,
    wip: setMap(state.wip, key, false),
    errors: setMap(state.errors, key, null),
  };
};

const onNewSource = (state, action) => {
  const { source, author } = action.payload;
  if (!author) {
    return state;
  }

  const a = { ...state.byID.get(author) };
  a.sources.push(source.id);

  return {
    ...state,
    byID: setMap(state.byID, author, a)
  };
};

export const reducer = handleActions({
  [FETCH_ALL]: onRequest,
  [FETCH_ALL_SUCCESS]: onSuccess,
  [FETCH_ALL_FAILURE]: onFailure,

  [sources.CREATE_SUCCESS]: onNewSource,
}, initialState);

/* Selectors */

const getAuthors              = state => state.byID;
const getAuthorById           = state => id => state.byID.get(id);
const getWIP                  = state => key => state.wip.get(key);
const getError                = state => key => state.errors.get(key);
const getAuthorsList          = createSelector(getAuthors, authors => Array.from(authors.values()));
const getAuthorByCollectionId = createSelector(getAuthorsList, getAuthorById,
  (authors, byId) => {
    const pairs = authors.reduce((acc, val) => acc.concat(val.sources.map(x => [x, val.id])), []);
    const m     = new Map(pairs);
    return memoize(id => byId(m.get(id)));
  });

export const selectors = {
  getWIP,
  getError,
  getAuthorsList,
  getAuthorByCollectionId,
};
