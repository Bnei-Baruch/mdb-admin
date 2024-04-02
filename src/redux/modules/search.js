import { createAction, handleActions } from 'redux-actions';
/* Types */

const SEARCH_COLLECTIONS         = 'Collections/SEARCH_COLLECTIONS';
const SEARCH_COLLECTIONS_SUCCESS = 'Collections/SEARCH_COLLECTIONS_SUCCESS';
const SEARCH_COLLECTIONS_FAILURE = 'Collections/SEARCH_COLLECTIONS_FAILURE';

export const types = {
  SEARCH_COLLECTIONS,
  SEARCH_COLLECTIONS_SUCCESS,
  SEARCH_COLLECTIONS_FAILURE,
};

/* Actions */

const searchCollections        = createAction(SEARCH_COLLECTIONS, (query) => ({ query }));
const searchCollectionsSuccess = createAction(SEARCH_COLLECTIONS_SUCCESS);
const searchCollectionsFailure = createAction(SEARCH_COLLECTIONS_FAILURE);

export const actions = {
  searchCollections,
  searchCollectionsSuccess,
  searchCollectionsFailure,
};

/* Reducer */

const initialState = {
  collections: [],
  wip        : false,
  error      : null,
};

const onRequest = (state) => ({ ...state, wip: true });

const onFailure = (state, action) => {
  return {
    ...state,
    wip  : false,
    error: action.payload,
  };
};

const onSuccess = (state, action) => {
  return {
    ...state,
    collections: action.payload.map(c => c.id),
    wip        : false,
    error      : null,
  };
};

export const reducer = handleActions({
  [SEARCH_COLLECTIONS]        : onRequest,
  [SEARCH_COLLECTIONS_SUCCESS]: onSuccess,
  [SEARCH_COLLECTIONS_FAILURE]: onFailure,
}, initialState);

/* Selectors */
const getCollections = state => state.collections;
const getWIP         = state => state.wip;
const getError       = state => state.error;

export const selectors = { getCollections, getWIP, getError };
