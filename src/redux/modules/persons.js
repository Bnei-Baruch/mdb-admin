import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import memoize from 'lodash/memoize';

import { setMap, merge, bulkMerge, del } from '../utils';

/* Types */

const FETCH_ITEM         = 'Persons/FETCH_ITEM';
const FETCH_ITEM_SUCCESS = 'Persons/FETCH_ITEM_SUCCESS';
const FETCH_ITEM_FAILURE = 'Persons/FETCH_ITEM_FAILURE';
const FETCH_ALL          = 'Persons/FETCH_ALL';
const FETCH_ALL_SUCCESS  = 'Persons/FETCH_ALL_SUCCESS';
const FETCH_ALL_FAILURE  = 'Persons/FETCH_ALL_FAILURE';

const CREATE         = 'Persons/CREATE';
const CREATE_SUCCESS = 'Persons/CREATE_SUCCESS';
const CREATE_FAILURE = 'Persons/CREATE_FAILURE';

const UPDATE_I18N         = 'Persons/UPDATE_I18N';
const UPDATE_I18N_SUCCESS = 'Persons/UPDATE_I18N_SUCCESS';
const UPDATE_I18N_FAILURE = 'Persons/UPDATE_I18N_FAILURE';
const UPDATE_INFO         = 'Persons/UPDATE_INFO';
const UPDATE_INFO_SUCCESS = 'Persons/UPDATE_INFO_SUCCESS';
const UPDATE_INFO_FAILURE = 'Persons/UPDATE_INFO_FAILURE';

const DELETE         = 'Persons/DELETE';
const DELETE_SUCCESS = 'Persons/DELETE_SUCCESS';
const DELETE_FAILURE = 'Persons/DELETE_FAILURE';

const RECEIVE_ITEMS = 'Persons/RECEIVE_ITEMS';

export const types = {
  FETCH_ITEM,
  FETCH_ITEM_SUCCESS,
  FETCH_ITEM_FAILURE,
  FETCH_ALL,
  FETCH_ALL_SUCCESS,
  FETCH_ALL_FAILURE,

  CREATE,
  CREATE_SUCCESS,
  CREATE_FAILURE,

  UPDATE_I18N,
  UPDATE_I18N_SUCCESS,
  UPDATE_I18N_FAILURE,
  UPDATE_INFO,
  UPDATE_INFO_SUCCESS,
  UPDATE_INFO_FAILURE,
  DELETE,
  DELETE_SUCCESS,
  DELETE_FAILURE,

  RECEIVE_ITEMS,
};

/* Actions */

const fetchItem        = createAction(FETCH_ITEM);
const fetchItemSuccess = createAction(FETCH_ITEM_SUCCESS);
const fetchItemFailure = createAction(FETCH_ITEM_FAILURE);
const fetchAll         = createAction(FETCH_ALL);
const fetchAllSuccess  = createAction(FETCH_ALL_SUCCESS);
const fetchAllFailure  = createAction(FETCH_ALL_FAILURE);

const create        = createAction(CREATE, (pattern, i18n) => ({ pattern, i18n }));
const createSuccess = createAction(CREATE_SUCCESS);
const createFailure = createAction(CREATE_FAILURE);

const deletePerson      = createAction(DELETE);
const deleteSuccess     = createAction(DELETE_SUCCESS);
const deleteFailure     = createAction(DELETE_FAILURE);
const updateI18n        = createAction(UPDATE_I18N, (id, i18n) => ({ id, i18n }));
const updateI18nSuccess = createAction(UPDATE_I18N_SUCCESS);
const updateI18nFailure = createAction(UPDATE_I18N_FAILURE);
const updateInfo        = createAction(UPDATE_INFO, (id, pattern) => ({ id, pattern }));
const updateInfoSuccess = createAction(UPDATE_INFO_SUCCESS);
const updateInfoFailure = createAction(UPDATE_INFO_FAILURE);

const receiveItems = createAction(RECEIVE_ITEMS);

export const actions = {
  fetchItem,
  fetchItemSuccess,
  fetchItemFailure,
  fetchAll,
  fetchAllSuccess,
  fetchAllFailure,

  create,
  createSuccess,
  createFailure,

  updateInfo,
  updateInfoSuccess,
  updateInfoFailure,
  updateI18n,
  updateI18nSuccess,
  updateI18nFailure,
  deletePerson,
  deleteSuccess,
  deleteFailure,

  receiveItems,
};

/* Reducer */

const keys = new Map([
  [FETCH_ITEM, 'fetchItem'],
  [FETCH_ITEM_SUCCESS, 'fetchItem'],
  [FETCH_ITEM_FAILURE, 'fetchItem'],
  [FETCH_ALL, 'fetchAll'],
  [FETCH_ALL_SUCCESS, 'fetchAll'],
  [FETCH_ALL_FAILURE, 'fetchAll'],

  [CREATE, 'create'],
  [CREATE_SUCCESS, 'create'],
  [CREATE_FAILURE, 'create'],

  [UPDATE_INFO, 'updateInfo'],
  [UPDATE_INFO_SUCCESS, 'updateInfo'],
  [UPDATE_INFO_FAILURE, 'updateInfo'],
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
  case CREATE:
  case FETCH_ITEM_SUCCESS:
  case UPDATE_I18N_SUCCESS:
  case UPDATE_INFO_SUCCESS:
    byID = merge(state.byID, action.payload);
    break;
  case FETCH_ALL_SUCCESS:
    byID = new Map(action.payload.map(x => [x.id, x]));
    break;
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
  [FETCH_ALL]: onRequest,
  [FETCH_ALL_SUCCESS]: onSuccess,
  [FETCH_ALL_FAILURE]: onFailure,

  [CREATE]: onRequest,
  [CREATE_SUCCESS]: onSuccess,
  [CREATE_FAILURE]: onFailure,

  [UPDATE_INFO]: onRequest,
  [UPDATE_INFO_SUCCESS]: onSuccess,
  [UPDATE_INFO_FAILURE]: onFailure,
  [UPDATE_I18N]: onRequest,
  [UPDATE_I18N_SUCCESS]: onSuccess,
  [UPDATE_I18N_FAILURE]: onFailure,
  [DELETE]: onRequest,
  [DELETE_SUCCESS]: onSuccess,
  [DELETE_FAILURE]: onFailure,

  [RECEIVE_ITEMS]: onReceiveItems,
}, initialState);

/* Selectors */

const getPersons       = state => state.byID;
const getPersonById    = (state, id) => state.byID.get(id);
const getWIP           = (state, key) => state.wip.get(key);
const getError         = (state, key) => state.errors.get(key);
const denormIDs        = createSelector(getPersons, byID => memoize(ids => ids.map(id => byID.get(id))));
const getPersonList    = createSelector(getPersons, persons => Array.from(persons.values()));
export const selectors = {
  getWIP,
  getError,
  denormIDs,
  getPersonById,
  getPersonList,
};
