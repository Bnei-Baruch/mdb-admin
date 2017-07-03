import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

import { merge, setMap } from '../utils';

/* Types */

const FETCH_ITEM               = 'Operations/FETCH_ITEM';
const FETCH_ITEM_SUCCESS       = 'Operations/FETCH_ITEM_SUCCESS';
const FETCH_ITEM_FAILURE       = 'Operations/FETCH_ITEM_FAILURE';
const FETCH_ITEM_FILES         = 'Operations/FETCH_ITEM_FILES';
const FETCH_ITEM_FILES_SUCCESS = 'Operations/FETCH_ITEM_FILES_SUCCESS';
const FETCH_ITEM_FILES_FAILURE = 'Operations/FETCH_ITEM_FILES_FAILURE';

export const types = {
  FETCH_ITEM,
  FETCH_ITEM_SUCCESS,
  FETCH_ITEM_FAILURE,
  FETCH_ITEM_FILES,
  FETCH_ITEM_FILES_SUCCESS,
  FETCH_ITEM_FILES_FAILURE,
};

/* Actions */

const fetchItem             = createAction(FETCH_ITEM);
const fetchItemSuccess      = createAction(FETCH_ITEM_SUCCESS);
const fetchItemFailure      = createAction(FETCH_ITEM_FAILURE);
const fetchItemFiles        = createAction(FETCH_ITEM_FILES);
const fetchItemFilesSuccess = createAction(FETCH_ITEM_FILES_SUCCESS);
const fetchItemFilesFailure = createAction(FETCH_ITEM_FILES_FAILURE);

export const actions = {
  fetchItem,
  fetchItemSuccess,
  fetchItemFailure,
  fetchItemFiles,
  fetchItemFilesSuccess,
  fetchItemFilesFailure,
};

/* Reducer */

const keys = new Map([
  [FETCH_ITEM, 'fetchItem'],
  [FETCH_ITEM_SUCCESS, 'fetchItem'],
  [FETCH_ITEM_FAILURE, 'fetchItem'],
  [FETCH_ITEM_FILES, 'fetchItemFiles'],
  [FETCH_ITEM_FILES_SUCCESS, 'fetchItemFiles'],
  [FETCH_ITEM_FILES_FAILURE, 'fetchItemFiles'],
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
  case FETCH_ITEM_SUCCESS:
    byID = merge(state.byID, action.payload);
    break;
  case FETCH_ITEM_FILES_SUCCESS:
    byID = merge(state.byID, {
      id: action.payload.id,
      files: action.payload.data.map(x => x.id),
    });
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

export const reducer = handleActions({
  [FETCH_ITEM]: onRequest,
  [FETCH_ITEM_SUCCESS]: onSuccess,
  [FETCH_ITEM_FAILURE]: onFailure,
  [FETCH_ITEM_FILES]: onRequest,
  [FETCH_ITEM_FILES_SUCCESS]: onSuccess,
  [FETCH_ITEM_FILES_FAILURE]: onFailure,
}, initialState);

/* Selectors */

const getOperations    = state => state.byID;
const getOperationById = (state, id) => state.byID.get(id);
const getWIP           = (state, key) => state.wip.get(key);
const getError         = (state, key) => state.errors.get(key);

export const selectors = {
  getOperations,
  getOperationById,
  getWIP,
  getError,
};
