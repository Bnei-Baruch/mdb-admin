import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import memoize from 'lodash/memoize';

import { bulkMerge, del, merge, setMap, update } from '../utils';

/* Types */

const FETCH_ITEM               = 'Collections/FETCH_ITEM';
const FETCH_ITEM_SUCCESS       = 'Collections/FETCH_ITEM_SUCCESS';
const FETCH_ITEM_FAILURE       = 'Collections/FETCH_ITEM_FAILURE';
const FETCH_ITEM_UNITS         = 'Collections/FETCH_ITEM_UNITS';
const FETCH_ITEM_UNITS_SUCCESS = 'Collections/FETCH_ITEM_UNITS_SUCCESS';
const FETCH_ITEM_UNITS_FAILURE = 'Collections/FETCH_ITEM_UNITS_FAILURE';

const UPDATE_I18N                         = 'Collections/UPDATE_I18N';
const UPDATE_I18N_SUCCESS                 = 'Collections/UPDATE_I18N_SUCCESS';
const UPDATE_I18N_FAILURE                 = 'Collections/UPDATE_I18N_FAILURE';
const UPDATE_PROPERTIES                   = 'Collections/UPDATE_PROPERTIES';
const ORDER_POSITIONS                     = 'Collections/ORDER_POSITIONS';
const UPDATE_PROPERTIES_SUCCESS           = 'Collections/UPDATE_PROPERTIES_SUCCESS';
const UPDATE_PROPERTIES_FAILURE           = 'Collections/UPDATE_PROPERTIES_FAILURE';
const CHANGE_SECURITY_LEVEL               = 'Collections/CHANGE_SECURITY_LEVEL';
const CHANGE_SECURITY_LEVEL_SUCCESS       = 'Collections/CHANGE_SECURITY_LEVEL_SUCCESS';
const CHANGE_SECURITY_LEVEL_FAILURE       = 'Collections/CHANGE_SECURITY_LEVEL_FAILURE';
const CHANGE_ACTIVE                       = 'Collections/CHANGE_ACTIVE';
const CHANGE_ACTIVE_SUCCESS               = 'Collections/CHANGE_ACTIVE_SUCCESS';
const CHANGE_ACTIVE_FAILURE               = 'Collections/CHANGE_ACTIVE_FAILURE';
const CREATE                              = 'Collections/CREATE';
const CREATE_SUCCESS                      = 'Collections/CREATE_SUCCESS';
const CREATE_FAILURE                      = 'Collections/CREATE_FAILURE';
const DELETE                              = 'Collections/DELETE';
const DELETE_SUCCESS                      = 'Collections/DELETE_SUCCESS';
const DELETE_FAILURE                      = 'Collections/DELETE_FAILURE';
const ASSOCIATE_UNIT                      = 'Collections/ASSOCIATE_UNIT_PROPERTIES';
const ASSOCIATE_UNIT_SUCCESS              = 'Collections/ASSOCIATE_UNIT_SUCCESS';
const ASSOCIATE_UNIT_FAILURE              = 'Collections/ASSOCIATE_UNIT_FAILURE';
const UPDATE_ITEM_UNIT_PROPERTIES         = 'Collections/UPDATE_ITEM_UNIT_PROPERTIES';
const UPDATE_ITEM_UNIT_PROPERTIES_SUCCESS = 'Collections/UPDATE_ITEM_UNIT_PROPERTIES_SUCCESS';
const UPDATE_ITEM_UNIT_PROPERTIES_FAILURE = 'Collections/UPDATE_ITEM_UNIT_PROPERTIES_FAILURE';
const DELETE_ITEM_UNIT                    = 'Collections/DELETE_ITEM_UNIT';
const DELETE_ITEM_UNIT_SUCCESS            = 'Collections/DELETE_ITEM_UNIT_SUCCESS';
const DELETE_ITEM_UNIT_FAILURE            = 'Collections/DELETE_ITEM_UNIT_FAILURE';

const RECEIVE_ITEMS = 'Collections/RECEIVE_ITEMS';

export const types = {
  FETCH_ITEM,
  FETCH_ITEM_SUCCESS,
  FETCH_ITEM_FAILURE,
  FETCH_ITEM_UNITS,
  FETCH_ITEM_UNITS_SUCCESS,
  FETCH_ITEM_UNITS_FAILURE,

  UPDATE_I18N,
  UPDATE_I18N_SUCCESS,
  UPDATE_I18N_FAILURE,
  ORDER_POSITIONS,
  UPDATE_PROPERTIES,
  UPDATE_PROPERTIES_SUCCESS,
  UPDATE_PROPERTIES_FAILURE,
  CHANGE_SECURITY_LEVEL,
  CHANGE_SECURITY_LEVEL_SUCCESS,
  CHANGE_SECURITY_LEVEL_FAILURE,
  CHANGE_ACTIVE,
  CHANGE_ACTIVE_SUCCESS,
  CHANGE_ACTIVE_FAILURE,
  CREATE,
  CREATE_SUCCESS,
  CREATE_FAILURE,
  DELETE,
  DELETE_SUCCESS,
  DELETE_FAILURE,
  ASSOCIATE_UNIT,
  ASSOCIATE_UNIT_SUCCESS,
  ASSOCIATE_UNIT_FAILURE,
  UPDATE_ITEM_UNIT_PROPERTIES,
  UPDATE_ITEM_UNIT_PROPERTIES_SUCCESS,
  UPDATE_ITEM_UNIT_PROPERTIES_FAILURE,
  DELETE_ITEM_UNIT,
  DELETE_ITEM_UNIT_SUCCESS,
  DELETE_ITEM_UNIT_FAILURE,

  RECEIVE_ITEMS,
};

/* Actions */

const fetchItem             = createAction(FETCH_ITEM);
const fetchItemSuccess      = createAction(FETCH_ITEM_SUCCESS);
const fetchItemFailure      = createAction(FETCH_ITEM_FAILURE);
const fetchItemUnits        = createAction(FETCH_ITEM_UNITS);
const fetchItemUnitsSuccess = createAction(FETCH_ITEM_UNITS_SUCCESS);
const fetchItemUnitsFailure = createAction(FETCH_ITEM_UNITS_FAILURE);

const updateI18n                      = createAction(UPDATE_I18N, (id, i18n) => ({ id, i18n }));
const updateI18nSuccess               = createAction(UPDATE_I18N_SUCCESS);
const updateI18nFailure               = createAction(UPDATE_I18N_FAILURE);
const orderPositions                  = createAction(ORDER_POSITIONS, (id, order_type) => ({ id, order_type }));
const updateProperties                = createAction(UPDATE_PROPERTIES, (id, properties) => ({ id, properties }));
const updatePropertiesSuccess         = createAction(UPDATE_PROPERTIES_SUCCESS);
const updatePropertiesFailure         = createAction(UPDATE_PROPERTIES_FAILURE);
const changeSecurityLevel             = createAction(CHANGE_SECURITY_LEVEL, (id, level) => ({ id, level }));
const changeSecurityLevelSuccess      = createAction(CHANGE_SECURITY_LEVEL_SUCCESS);
const changeSecurityLevelFailure      = createAction(CHANGE_SECURITY_LEVEL_FAILURE);
const changeActive                    = createAction(CHANGE_ACTIVE);
const changeActiveSuccess             = createAction(CHANGE_ACTIVE_SUCCESS);
const changeActiveFailure             = createAction(CHANGE_ACTIVE_FAILURE);
const create                          = createAction(CREATE, (typeID, properties, i18n) => ({
  type_id: typeID,
  properties,
  i18n
}));
const createSuccess                   = createAction(CREATE_SUCCESS);
const createFailure                   = createAction(CREATE_FAILURE);
const deleteC                         = createAction(DELETE);
const deleteSuccess                   = createAction(DELETE_SUCCESS);
const deleteFailure                   = createAction(DELETE_FAILURE);
const associateUnit                   = createAction(ASSOCIATE_UNIT, (id, properties) => ({ id, properties }));
const associateUnitSuccess            = createAction(ASSOCIATE_UNIT_SUCCESS);
const associateUnitFailure            = createAction(ASSOCIATE_UNIT_FAILURE);
const updateItemUnitProperties        = createAction(UPDATE_ITEM_UNIT_PROPERTIES, (id, ccuId, properties) => ({
  id,
  ccuId,
  properties
}));
const updateItemUnitPropertiesSuccess = createAction(UPDATE_ITEM_UNIT_PROPERTIES_SUCCESS);
const updateItemUnitPropertiesFailure = createAction(UPDATE_ITEM_UNIT_PROPERTIES_FAILURE);
const deleteItemUnit                  = createAction(DELETE_ITEM_UNIT, (id, ccuId) => ({ id, ccuId }));
const deleteItemUnitSuccess           = createAction(DELETE_ITEM_UNIT_SUCCESS);
const deleteItemUnitFailure           = createAction(DELETE_ITEM_UNIT_FAILURE);

const receiveItems = createAction(RECEIVE_ITEMS);

export const actions = {
  fetchItem,
  fetchItemSuccess,
  fetchItemFailure,
  fetchItemUnits,
  fetchItemUnitsSuccess,
  fetchItemUnitsFailure,

  updateI18n,
  updateI18nSuccess,
  updateI18nFailure,
  orderPositions,
  updateProperties,
  updatePropertiesSuccess,
  updatePropertiesFailure,
  changeSecurityLevel,
  changeSecurityLevelSuccess,
  changeSecurityLevelFailure,
  changeActive,
  changeActiveSuccess,
  changeActiveFailure,
  create,
  createSuccess,
  createFailure,
  deleteC,
  deleteSuccess,
  deleteFailure,
  associateUnit,
  associateUnitSuccess,
  associateUnitFailure,
  updateItemUnitProperties,
  updateItemUnitPropertiesSuccess,
  updateItemUnitPropertiesFailure,
  deleteItemUnit,
  deleteItemUnitSuccess,
  deleteItemUnitFailure,

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

  [UPDATE_I18N, 'updateI18n'],
  [UPDATE_I18N_SUCCESS, 'updateI18n'],
  [UPDATE_I18N_FAILURE, 'updateI18n'],
  [UPDATE_PROPERTIES, 'updateProperties'],
  [UPDATE_PROPERTIES_SUCCESS, 'updateProperties'],
  [UPDATE_PROPERTIES_FAILURE, 'updateProperties'],
  [CHANGE_SECURITY_LEVEL, 'changeSecurityLevel'],
  [CHANGE_SECURITY_LEVEL_SUCCESS, 'changeSecurityLevel'],
  [CHANGE_SECURITY_LEVEL_FAILURE, 'changeSecurityLevel'],
  [CHANGE_ACTIVE, 'changeActive'],
  [CHANGE_ACTIVE_SUCCESS, 'changeActive'],
  [CHANGE_ACTIVE_FAILURE, 'changeActive'],
  [CREATE, 'create'],
  [CREATE_SUCCESS, 'create'],
  [CREATE_FAILURE, 'create'],
  [DELETE, 'delete'],
  [DELETE_SUCCESS, 'delete'],
  [DELETE_FAILURE, 'delete'],
  [ASSOCIATE_UNIT, 'associateUnit'],
  [ASSOCIATE_UNIT_SUCCESS, 'associateUnit'],
  [ASSOCIATE_UNIT_FAILURE, 'associateUnit'],
  [UPDATE_ITEM_UNIT_PROPERTIES, 'updateItemUnitProperties'],
  [UPDATE_ITEM_UNIT_PROPERTIES_SUCCESS, 'updateItemUnitProperties'],
  [UPDATE_ITEM_UNIT_PROPERTIES_FAILURE, 'updateItemUnitProperties'],
  [DELETE_ITEM_UNIT, 'deleteItemUnit'],
  [DELETE_ITEM_UNIT_SUCCESS, 'deleteItemUnit'],
  [DELETE_ITEM_UNIT_FAILURE, 'deleteItemUnit'],
]);

const initialState = {
  byID  : new Map(),
  wip   : new Map(Array.from(keys.values(), x => [x, false])),
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
    wip   : setMap(state.wip, key, false),
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
    case CHANGE_ACTIVE_SUCCESS:
    case CREATE_SUCCESS:
    case UPDATE_PROPERTIES_SUCCESS:
      byID = merge(state.byID, action.payload);
      break;
    case FETCH_ITEM_UNITS_SUCCESS:
      byID = merge(state.byID, {
        id           : action.payload.id,
        content_units: action.payload.data.map(x => ({
          name           : x.name,
          position       : x.position,
          content_unit_id: x.content_unit.id
        })),
      });
      break;
    case DELETE_SUCCESS:
      byID = del(state.byID, action.payload);
      break;
    case UPDATE_ITEM_UNIT_PROPERTIES_SUCCESS:
      byID = update(state.byID, action.payload.id, coll => ({
        ...coll,
        content_units: coll.content_units.map(x =>
          (x.content_unit_id !== action.payload.ccuId ? x : { ...x, ...action.payload.properties })),
      }));
      break;
    case DELETE_ITEM_UNIT_SUCCESS:
      byID = update(state.byID, action.payload.id, x => ({
        ...x,
        content_units: x.content_units ? x.content_units.filter(ccu => ccu.content_unit_id !== action.payload.ccuId) : []
      }));

      break;
    case ASSOCIATE_UNIT_SUCCESS:
      byID = update(state.byID, action.payload.id, x => ({
        ...x,
        content_units: [...(x.content_units || []), ...action.payload.properties]
      }));

      break;
    default:
      byID = state.byID;
  }

  return {
    ...state,
    byID,
    wip   : setMap(state.wip, key, false),
    errors: setMap(state.errors, key, null),
  };
};

const onReceiveItems = (state, action) => ({
  ...state,
  byID: bulkMerge(state.byID, action.payload),
});

export const reducer = handleActions({
  [FETCH_ITEM]              : onRequest,
  [FETCH_ITEM_SUCCESS]      : onSuccess,
  [FETCH_ITEM_FAILURE]      : onFailure,
  [FETCH_ITEM_UNITS]        : onRequest,
  [FETCH_ITEM_UNITS_SUCCESS]: onSuccess,
  [FETCH_ITEM_UNITS_FAILURE]: onFailure,

  [UPDATE_I18N]                        : onRequest,
  [UPDATE_I18N_SUCCESS]                : onSuccess,
  [UPDATE_I18N_FAILURE]                : onFailure,
  [UPDATE_PROPERTIES]                  : onRequest,
  [UPDATE_PROPERTIES_SUCCESS]          : onSuccess,
  [UPDATE_PROPERTIES_FAILURE]          : onFailure,
  [CHANGE_SECURITY_LEVEL]              : onRequest,
  [CHANGE_SECURITY_LEVEL_SUCCESS]      : onSuccess,
  [CHANGE_SECURITY_LEVEL_FAILURE]      : onFailure,
  [CHANGE_ACTIVE]                      : onRequest,
  [CHANGE_ACTIVE_SUCCESS]              : onSuccess,
  [CHANGE_ACTIVE_FAILURE]              : onFailure,
  [CREATE]                             : onRequest,
  [CREATE_SUCCESS]                     : onSuccess,
  [CREATE_FAILURE]                     : onFailure,
  [DELETE]                             : onRequest,
  [DELETE_SUCCESS]                     : onSuccess,
  [DELETE_FAILURE]                     : onFailure,
  [ASSOCIATE_UNIT]                     : onRequest,
  [ASSOCIATE_UNIT_SUCCESS]             : onSuccess,
  [ASSOCIATE_UNIT_FAILURE]             : onFailure,
  [UPDATE_ITEM_UNIT_PROPERTIES]        : onRequest,
  [UPDATE_ITEM_UNIT_PROPERTIES_SUCCESS]: onSuccess,
  [UPDATE_ITEM_UNIT_PROPERTIES_FAILURE]: onFailure,
  [DELETE_ITEM_UNIT]                   : onRequest,
  [DELETE_ITEM_UNIT_SUCCESS]           : onSuccess,
  [DELETE_ITEM_UNIT_FAILURE]           : onFailure,

  [RECEIVE_ITEMS]: onReceiveItems,

}, initialState);

/* Selectors */

const getCollections    = state => state.byID;
const getCollectionById = (state, id) => state.byID.get(id);
const getWIP            = (state, key) => state.wip.get(key);
const getError          = (state, key) => state.errors.get(key);

const denormIDs = createSelector(getCollections, byID =>
  memoize(ids => ids.map(id => byID.get(id))));

// CCU = CollectionContentUnit
const denormCCUs = createSelector(getCollections, byID =>
  memoize(ccus => ccus.map(x => ({ ...x, collection: byID.get(x.collection_id) }))));

export const selectors = {
  getCollectionById,
  getWIP,
  getError,
  denormIDs,
  denormCCUs
};
