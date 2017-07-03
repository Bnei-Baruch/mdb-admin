import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import memoize from 'lodash/memoize';

import { bulkMerge, merge, setMap } from '../utils';

/* Types */

const FETCH_ITEM         = 'Files/FETCH_ITEM';
const FETCH_ITEM_SUCCESS = 'Files/FETCH_ITEM_SUCCESS';
const FETCH_ITEM_FAILURE = 'Files/FETCH_ITEM_FAILURE';

const CHANGE_SECURITY_LEVEL         = 'Files/CHANGE_SECURITY_LEVEL';
const CHANGE_SECURITY_LEVEL_SUCCESS = 'Files/CHANGE_SECURITY_LEVEL_SUCCESS';
const CHANGE_SECURITY_LEVEL_FAILURE = 'Files/CHANGE_SECURITY_LEVEL_FAILURE';

const RECEIVE_ITEMS = 'Files/RECEIVE_ITEMS';

export const types = {
  FETCH_ITEM,
  FETCH_ITEM_SUCCESS,
  FETCH_ITEM_FAILURE,

  CHANGE_SECURITY_LEVEL,
  CHANGE_SECURITY_LEVEL_SUCCESS,
  CHANGE_SECURITY_LEVEL_FAILURE,

  RECEIVE_ITEMS,
};

/* Actions */

const fetchItem        = createAction(FETCH_ITEM);
const fetchItemSuccess = createAction(FETCH_ITEM_SUCCESS);
const fetchItemFailure = createAction(FETCH_ITEM_FAILURE);

const changeSecurityLevel        = createAction(CHANGE_SECURITY_LEVEL);
const changeSecurityLevelSuccess = createAction(CHANGE_SECURITY_LEVEL_SUCCESS);
const changeSecurityLevelFailure = createAction(CHANGE_SECURITY_LEVEL_FAILURE);

const receiveItems = createAction(RECEIVE_ITEMS);

export const actions = {
  fetchItem,
  fetchItemSuccess,
  fetchItemFailure,

  changeSecurityLevel,
  changeSecurityLevelSuccess,
  changeSecurityLevelFailure,

  receiveItems,
};

/* Reducer */

const keys = new Map([
  [FETCH_ITEM, 'fetchItem'],
  [FETCH_ITEM_SUCCESS, 'fetchItem'],
  [FETCH_ITEM_FAILURE, 'fetchItem'],

  [CHANGE_SECURITY_LEVEL, 'changeSecurityLevel'],
  [CHANGE_SECURITY_LEVEL_SUCCESS, 'changeSecurityLevel'],
  [CHANGE_SECURITY_LEVEL_FAILURE, 'changeSecurityLevel'],
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
  case CHANGE_SECURITY_LEVEL_SUCCESS:
  case FETCH_ITEM_SUCCESS:
    byID = merge(state.byID, action.payload);
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

const onReceiveItems = (state, action) => ({
  ...state,
  byID: bulkMerge(state.byID, action.payload)
});

export const reducer = handleActions({
  [FETCH_ITEM]: onRequest,
  [FETCH_ITEM_SUCCESS]: onSuccess,
  [FETCH_ITEM_FAILURE]: onFailure,

  [CHANGE_SECURITY_LEVEL]: onRequest,
  [CHANGE_SECURITY_LEVEL_SUCCESS]: onSuccess,
  [CHANGE_SECURITY_LEVEL_FAILURE]: onFailure,

  [RECEIVE_ITEMS]: onReceiveItems,

}, initialState);

/* Selectors */

const getFiles    = state => state.byID;
const getFileById = (state, id) => state.byID.get(id);
const getWIP      = (state, key) => state.wip.get(key);
const getError    = (state, key) => state.errors.get(key);

const denormIDs = createSelector(getFiles, byID =>
  memoize(ids => ids.map(id => byID.get(id))));

export const selectors = {
  getFileById,
  getWIP,
  getError,
  denormIDs,
};
