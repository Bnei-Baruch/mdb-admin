import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import memoize from 'lodash/memoize';

import { bulkMerge, merge, setMap } from '../utils';

/* Types */

const FETCH_ITEM               = 'Collections/FETCH_ITEM';
const FETCH_ITEM_SUCCESS       = 'Collections/FETCH_ITEM_SUCCESS';
const FETCH_ITEM_FAILURE       = 'Collections/FETCH_ITEM_FAILURE';
const FETCH_ITEM_UNITS         = 'Collections/FETCH_ITEM_UNITS';
const FETCH_ITEM_UNITS_SUCCESS = 'Collections/FETCH_ITEM_UNITS_SUCCESS';
const FETCH_ITEM_UNITS_FAILURE = 'Collections/FETCH_ITEM_UNITS_FAILURE';

const CHANGE_SECURITY_LEVEL         = 'Collections/CHANGE_SECURITY_LEVEL';
const CHANGE_SECURITY_LEVEL_SUCCESS = 'Collections/CHANGE_SECURITY_LEVEL_SUCCESS';
const CHANGE_SECURITY_LEVEL_FAILURE = 'Collections/CHANGE_SECURITY_LEVEL_FAILURE';
const UPDATE_I18N                   = 'Collections/UPDATE_I18N';
const UPDATE_I18N_SUCCESS           = 'Collections/UPDATE_I18N_SUCCESS';
const UPDATE_I18N_FAILURE           = 'Collections/UPDATE_I18N_FAILURE';

const RECEIVE_ITEMS = 'Collections/RECEIVE_ITEMS';

export const types = {
  FETCH_ITEM,
  FETCH_ITEM_SUCCESS,
  FETCH_ITEM_FAILURE,
  FETCH_ITEM_UNITS,
  FETCH_ITEM_UNITS_SUCCESS,
  FETCH_ITEM_UNITS_FAILURE,

  CHANGE_SECURITY_LEVEL,
  CHANGE_SECURITY_LEVEL_SUCCESS,
  CHANGE_SECURITY_LEVEL_FAILURE,
  UPDATE_I18N,
  UPDATE_I18N_SUCCESS,
  UPDATE_I18N_FAILURE,

  RECEIVE_ITEMS,
};

/* Actions */

const fetchItem             = createAction(FETCH_ITEM);
const fetchItemSuccess      = createAction(FETCH_ITEM_SUCCESS);
const fetchItemFailure      = createAction(FETCH_ITEM_FAILURE);
const fetchItemUnits        = createAction(FETCH_ITEM_UNITS);
const fetchItemUnitsSuccess = createAction(FETCH_ITEM_UNITS_SUCCESS);
const fetchItemUnitsFailure = createAction(FETCH_ITEM_UNITS_FAILURE);

const changeSecurityLevel        = createAction(CHANGE_SECURITY_LEVEL);
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
  fetchItemUnits,
  fetchItemUnitsSuccess,
  fetchItemUnitsFailure,

  changeSecurityLevel,
  changeSecurityLevelSuccess,
  changeSecurityLevelFailure,
  updateI18n,
  updateI18nSuccess,
  updateI18nFailure,

  receiveItems,
};

/* Reducer */

const keys = new Map([
  [FETCH_ITEM, 'fetchItem'],
  [FETCH_ITEM_SUCCESS, 'fetchItem'],
  [FETCH_ITEM_FAILURE, 'fetchItem'],
  [FETCH_ITEM_UNITS, 'fetchItemUnits'],
  [FETCH_ITEM_UNITS_SUCCESS, 'fetchItemUnits'],
  [FETCH_ITEM_UNITS_FAILURE, 'fetchItemUnits'],

  [CHANGE_SECURITY_LEVEL, 'changeSecurityLevel'],
  [CHANGE_SECURITY_LEVEL_SUCCESS, 'changeSecurityLevel'],
  [CHANGE_SECURITY_LEVEL_FAILURE, 'changeSecurityLevel'],
  [UPDATE_I18N, 'updateI18n'],
  [UPDATE_I18N_SUCCESS, 'updateI18n'],
  [UPDATE_I18N_FAILURE, 'updateI18n'],
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
  case CHANGE_SECURITY_LEVEL_SUCCESS:
    byID = merge(state.byID, action.payload);
    break;
  case FETCH_ITEM_UNITS_SUCCESS:
    byID = merge(state.byID, {
      id: action.payload.id,
      content_units: action.payload.data.map(x => ({ name: x.name, content_unit_id: x.content_unit.id })),
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

const onReceiveItems = (state, action) => ({
  ...state,
  byID: bulkMerge(state.byID, action.payload),
});

export const reducer = handleActions({
  [FETCH_ITEM]: onRequest,
  [FETCH_ITEM_SUCCESS]: onSuccess,
  [FETCH_ITEM_FAILURE]: onFailure,
  [FETCH_ITEM_UNITS]: onRequest,
  [FETCH_ITEM_UNITS_SUCCESS]: onSuccess,
  [FETCH_ITEM_UNITS_FAILURE]: onFailure,

  [CHANGE_SECURITY_LEVEL]: onRequest,
  [CHANGE_SECURITY_LEVEL_SUCCESS]: onSuccess,
  [CHANGE_SECURITY_LEVEL_FAILURE]: onFailure,
  [UPDATE_I18N]: onRequest,
  [UPDATE_I18N_SUCCESS]: onSuccess,
  [UPDATE_I18N_FAILURE]: onFailure,

  [RECEIVE_ITEMS]: onReceiveItems,

}, initialState);

/* Selectors */

const getCollections    = state => state.byID;
const getCollectionById = state => id => state.byID.get(id);
const getWIP            = (state, key) => state.wip.get(key);
const getError          = (state, key) => state.errors.get(key);
const denormCCUs        = createSelector(getCollections, byID =>
  memoize(ccus => ccus.map(x => ({ ...x, collection: byID.get(x.collection_id) }))));

export const selectors = {
  getCollectionById,
  getWIP,
  getError,
  denormCCUs,
};
