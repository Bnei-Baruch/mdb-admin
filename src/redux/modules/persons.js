import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import memoize from 'lodash/memoize';

import { setMap, merge, bulkMerge } from '../utils';

/* Types */

const FETCH_ITEM                    = 'Persons/FETCH_ITEM';
const FETCH_ITEM_SUCCESS            = 'Persons/FETCH_ITEM_SUCCESS';
const FETCH_ITEM_FAILURE            = 'Persons/FETCH_ITEM_FAILURE';
const UPDATE_I18N                   = 'Persons/UPDATE_I18N';
const UPDATE_I18N_SUCCESS           = 'Persons/UPDATE_I18N_SUCCESS';
const UPDATE_I18N_FAILURE           = 'Persons/UPDATE_I18N_FAILURE';
const CREATE                        = 'Persons/CREATE';
const CREATE_SUCCESS                = 'Persons/CREATE_SUCCESS';
const CREATE_FAILURE                = 'Persons/CREATE_FAILURE';
const CHANGE_SECURITY_LEVEL         = 'Persons/CHANGE_SECURITY_LEVEL';
const CHANGE_SECURITY_LEVEL_SUCCESS = 'Persons/CHANGE_SECURITY_LEVEL_SUCCESS';
const CHANGE_SECURITY_LEVEL_FAILURE = 'Persons/CHANGE_SECURITY_LEVEL_FAILURE';

const RECEIVE_ITEMS = 'Persons/RECEIVE_ITEMS';

export const types = {
  FETCH_ITEM,
  FETCH_ITEM_SUCCESS,
  FETCH_ITEM_FAILURE,
  CREATE,
  CREATE_SUCCESS,
  CREATE_FAILURE,
  UPDATE_I18N,
  UPDATE_I18N_SUCCESS,
  UPDATE_I18N_FAILURE,
  CHANGE_SECURITY_LEVEL,
  CHANGE_SECURITY_LEVEL_SUCCESS,
  CHANGE_SECURITY_LEVEL_FAILURE,

  RECEIVE_ITEMS,
};

/* Actions */

const fetchItem                  = createAction(FETCH_ITEM);
const fetchItemSuccess           = createAction(FETCH_ITEM_SUCCESS);
const fetchItemFailure           = createAction(FETCH_ITEM_FAILURE);
const create                     = createAction(CREATE, (typeID, properties, i18n) => ({
  type_id: typeID,
  properties,
  i18n
}));
const createSuccess              = createAction(CREATE_SUCCESS);
const createFailure              = createAction(CREATE_FAILURE);
const changeSecurityLevel        = createAction(CHANGE_SECURITY_LEVEL, (id, level) => ({ id, level }));
const changeSecurityLevelSuccess = createAction(CHANGE_SECURITY_LEVEL_SUCCESS);
const changeSecurityLevelFailure = createAction(CHANGE_SECURITY_LEVEL_FAILURE);
const updateI18n                 = createAction(UPDATE_I18N, (id, i18n) => ({ id, i18n }));
const updateI18nSuccess          = createAction(UPDATE_I18N_SUCCESS);
const updateI18nFailure          = createAction(UPDATE_I18N_FAILURE);

const receiveItems = createAction(RECEIVE_ITEMS);

export const actions = {
  fetchItem,
  fetchItemSuccess,
  fetchItemFailure,
  create,
  createSuccess,
  createFailure,
  updateI18n,
  updateI18nSuccess,
  updateI18nFailure,
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

  [CREATE, 'create'],
  [CREATE_SUCCESS, 'create'],
  [CREATE_FAILURE, 'create'],
  [UPDATE_I18N, 'updateI18n'],
  [UPDATE_I18N_SUCCESS, 'updateI18n'],
  [UPDATE_I18N_FAILURE, 'updateI18n'],
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
  case CREATE:
  case FETCH_ITEM_SUCCESS:
  case UPDATE_I18N_SUCCESS:
  case CHANGE_SECURITY_LEVEL_SUCCESS:
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

  [CREATE]: onRequest,
  [CREATE_SUCCESS]: onSuccess,
  [CREATE_FAILURE]: onFailure,
  [UPDATE_I18N]: onRequest,
  [UPDATE_I18N_SUCCESS]: onSuccess,
  [UPDATE_I18N_FAILURE]: onFailure,
  [CHANGE_SECURITY_LEVEL]: onRequest,
  [CHANGE_SECURITY_LEVEL_SUCCESS]: onSuccess,
  [CHANGE_SECURITY_LEVEL_FAILURE]: onFailure,

  [RECEIVE_ITEMS]: onReceiveItems,
}, initialState);

/* Selectors */

const getPersons       = state => state.byID;
const getPersonById    = (state, id) => state.byID.get(id);
const getWIP           = (state, key) => state.wip.get(key);
const getError         = (state, key) => state.errors.get(key);
const denormIDs        = createSelector(getPersons, byID => memoize(ids => ids.map(id => byID.get(id))));
export const selectors = {
  getWIP,
  getError,
  denormIDs,
  getPersonById,
};
