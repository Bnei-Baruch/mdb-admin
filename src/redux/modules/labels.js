import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import memoize from 'lodash/memoize';

import { bulkMerge, del, setMap } from '../utils';

/* Types */

const FETCH_ITEM         = 'Labels/FETCH_ITEM';
const FETCH_ITEM_SUCCESS = 'Labels/FETCH_ITEM_SUCCESS';
const FETCH_ITEM_FAILURE = 'Labels/FETCH_ITEM_FAILURE';

const UPDATE_I18N         = 'Labels/UPDATE_I18N';
const UPDATE_I18N_SUCCESS = 'Labels/UPDATE_I18N_SUCCESS';
const UPDATE_I18N_FAILURE = 'Labels/UPDATE_I18N_FAILURE';

const DELETE         = 'Labels/DELETE';
const DELETE_SUCCESS = 'Labels/DELETE_SUCCESS';
const DELETE_FAILURE = 'Labels/DELETE_FAILURE';

const RECEIVE_ITEMS = 'Labels/RECEIVE_ITEMS';

export const types = {
  FETCH_ITEM,
  FETCH_ITEM_SUCCESS,
  FETCH_ITEM_FAILURE,

  UPDATE_I18N,
  UPDATE_I18N_SUCCESS,
  UPDATE_I18N_FAILURE,

  DELETE,
  DELETE_SUCCESS,
  DELETE_FAILURE,

  RECEIVE_ITEMS,
};

/* Actions */
const fetchItem        = createAction(FETCH_ITEM);
const fetchItemSuccess = createAction(FETCH_ITEM_SUCCESS);
const fetchItemFailure = createAction(FETCH_ITEM_FAILURE);

const deleteLabel   = createAction(DELETE);
const deleteSuccess = createAction(DELETE_SUCCESS);
const deleteFailure = createAction(DELETE_FAILURE);

const updateI18n        = createAction(UPDATE_I18N, (id, i18n) => ({ id, i18n }));
const updateI18nSuccess = createAction(UPDATE_I18N_SUCCESS);
const updateI18nFailure = createAction(UPDATE_I18N_FAILURE);

const receiveItems = createAction(RECEIVE_ITEMS);

export const actions = {
  fetchItem,
  fetchItemSuccess,
  fetchItemFailure,

  updateI18n,
  updateI18nSuccess,
  updateI18nFailure,

  deleteLabel,
  deleteSuccess,
  deleteFailure,

  receiveItems,
};

/* Reducer */

const keys = new Map([
  [FETCH_ITEM, 'fetchItem'],
  [FETCH_ITEM_SUCCESS, 'fetchItem'],
  [FETCH_ITEM_FAILURE, 'fetchItem'],

  [UPDATE_I18N, 'updateI18n'],
  [UPDATE_I18N_SUCCESS, 'updateI18n'],
  [UPDATE_I18N_FAILURE, 'updateI18n'],

  [DELETE, 'delete'],
  [DELETE_SUCCESS, 'delete'],
  [DELETE_FAILURE, 'delete'],
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
  case UPDATE_I18N_SUCCESS:
  case DELETE_SUCCESS:
    byID = del(state.byID, action.payload);
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

  [UPDATE_I18N]: onRequest,
  [UPDATE_I18N_SUCCESS]: onSuccess,
  [UPDATE_I18N_FAILURE]: onFailure,

  [DELETE]: onRequest,
  [DELETE_SUCCESS]: onSuccess,
  [DELETE_FAILURE]: onFailure,

  [RECEIVE_ITEMS]: onReceiveItems,
}, initialState);

/* Selectors */

const getLabels     = state => state.byID;
const getLabelById  = (state, id) => state.byID.get(id);
const getWIP        = (state, key) => state.wip.get(key);
const getError      = (state, key) => state.errors.get(key);
const getLabelsList = createSelector(getLabels, labels => Array.from(labels.values()));
const denormIDs     = createSelector(getLabels, byID => memoize(ids => ids.map(id => byID.get(id))));

export const selectors = {
  getWIP,
  getError,
  denormIDs,
  getLabelById,
  getLabelsList,
};
