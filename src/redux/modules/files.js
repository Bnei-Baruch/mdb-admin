import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import memoize from 'lodash/memoize';

import { bulkMerge, merge, setMap } from '../utils';

/* Types */

const FETCH_ITEM                         = 'Files/FETCH_ITEM';
const FETCH_ITEM_SUCCESS                 = 'Files/FETCH_ITEM_SUCCESS';
const FETCH_ITEM_FAILURE                 = 'Files/FETCH_ITEM_FAILURE';
const FETCH_ITEM_STORAGES                = 'Files/FETCH_ITEM_STORAGES';
const FETCH_ITEM_STORAGES_SUCCESS        = 'Files/FETCH_ITEM_STORAGES_SUCCESS';
const FETCH_ITEM_STORAGES_FAILURE        = 'Files/FETCH_ITEM_STORAGES_FAILURE';
const FETCH_TREE_WITH_OPERATIONS         = 'Files/FETCH_TREE_WITH_OPERATIONS';
const FETCH_TREE_WITH_OPERATIONS_SUCCESS = 'Files/FETCH_TREE_WITH_OPERATIONS_SUCCESS';
const FETCH_TREE_WITH_OPERATIONS_FAILURE = 'Files/FETCH_TREE_WITH_OPERATIONS_FAILURE';

const CHANGE_SECURITY_LEVEL         = 'Files/CHANGE_SECURITY_LEVEL';
const CHANGE_SECURITY_LEVEL_SUCCESS = 'Files/CHANGE_SECURITY_LEVEL_SUCCESS';
const CHANGE_SECURITY_LEVEL_FAILURE = 'Files/CHANGE_SECURITY_LEVEL_FAILURE';
const UPDATE_PROPERTIES             = 'Files/UPDATE_PROPERTIES';
const UPDATE_PROPERTIES_SUCCESS     = 'Files/UPDATE_PROPERTIES_SUCCESS';
const UPDATE_PROPERTIES_FAILURE     = 'Files/UPDATE_PROPERTIES_FAILURE';

const RECEIVE_ITEMS = 'Files/RECEIVE_ITEMS';

export const types = {
  FETCH_ITEM,
  FETCH_ITEM_SUCCESS,
  FETCH_ITEM_FAILURE,
  FETCH_ITEM_STORAGES,
  FETCH_ITEM_STORAGES_SUCCESS,
  FETCH_ITEM_STORAGES_FAILURE,
  FETCH_TREE_WITH_OPERATIONS,
  FETCH_TREE_WITH_OPERATIONS_SUCCESS,
  FETCH_TREE_WITH_OPERATIONS_FAILURE,

  CHANGE_SECURITY_LEVEL,
  CHANGE_SECURITY_LEVEL_SUCCESS,
  CHANGE_SECURITY_LEVEL_FAILURE,
  UPDATE_PROPERTIES,
  UPDATE_PROPERTIES_SUCCESS,
  UPDATE_PROPERTIES_FAILURE,

  RECEIVE_ITEMS,
};

/* Actions */

const fetchItem                      = createAction(FETCH_ITEM);
const fetchItemSuccess               = createAction(FETCH_ITEM_SUCCESS);
const fetchItemFailure               = createAction(FETCH_ITEM_FAILURE);
const fetchItemStorages              = createAction(FETCH_ITEM_STORAGES);
const fetchItemStoragesSuccess       = createAction(FETCH_ITEM_STORAGES_SUCCESS);
const fetchItemStoragesFailure       = createAction(FETCH_ITEM_STORAGES_FAILURE);
const fetchTreeWithOperations        = createAction(FETCH_TREE_WITH_OPERATIONS);
const fetchTreeWithOperationsSuccess = createAction(FETCH_TREE_WITH_OPERATIONS_SUCCESS);
const fetchTreeWithOperationsFailure = createAction(FETCH_TREE_WITH_OPERATIONS_FAILURE);

const changeSecurityLevel        = createAction(CHANGE_SECURITY_LEVEL, (id, level) => ({ id, level }));
const changeSecurityLevelSuccess = createAction(CHANGE_SECURITY_LEVEL_SUCCESS);
const changeSecurityLevelFailure = createAction(CHANGE_SECURITY_LEVEL_FAILURE);
const updateProperties           = createAction(UPDATE_PROPERTIES, (id, properties) => ({ id, properties }));
const updatePropertiesSuccess    = createAction(UPDATE_PROPERTIES_SUCCESS);
const updatePropertiesFailure    = createAction(UPDATE_PROPERTIES_FAILURE);

const receiveItems = createAction(RECEIVE_ITEMS);

export const actions = {
  fetchItem,
  fetchItemSuccess,
  fetchItemFailure,
  fetchItemStorages,
  fetchItemStoragesSuccess,
  fetchItemStoragesFailure,
  fetchTreeWithOperations,
  fetchTreeWithOperationsSuccess,
  fetchTreeWithOperationsFailure,

  changeSecurityLevel,
  changeSecurityLevelSuccess,
  changeSecurityLevelFailure,
  updateProperties,
  updatePropertiesSuccess,
  updatePropertiesFailure,

  receiveItems,
};

/* Reducer */

const keys = new Map([
  [FETCH_ITEM, 'fetchItem'],
  [FETCH_ITEM_SUCCESS, 'fetchItem'],
  [FETCH_ITEM_FAILURE, 'fetchItem'],
  [FETCH_ITEM_STORAGES, 'fetchStorages'],
  [FETCH_ITEM_STORAGES_SUCCESS, 'fetchStorages'],
  [FETCH_ITEM_STORAGES_FAILURE, 'fetchStorages'],
  [FETCH_ITEM_STORAGES, 'fetchStorages'],
  [FETCH_ITEM_STORAGES_SUCCESS, 'fetchStorages'],
  [FETCH_ITEM_STORAGES_FAILURE, 'fetchStorages'],
  [FETCH_TREE_WITH_OPERATIONS, 'fetchTreeWithOperations'],
  [FETCH_TREE_WITH_OPERATIONS_SUCCESS, 'fetchTreeWithOperations'],
  [FETCH_TREE_WITH_OPERATIONS_FAILURE, 'fetchTreeWithOperations'],

  [CHANGE_SECURITY_LEVEL, 'changeSecurityLevel'],
  [CHANGE_SECURITY_LEVEL_SUCCESS, 'changeSecurityLevel'],
  [CHANGE_SECURITY_LEVEL_FAILURE, 'changeSecurityLevel'],
  [UPDATE_PROPERTIES, 'updateProperties'],
  [UPDATE_PROPERTIES_SUCCESS, 'updateProperties'],
  [UPDATE_PROPERTIES_FAILURE, 'updateProperties'],

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
  case UPDATE_PROPERTIES_SUCCESS:
    byID = merge(state.byID, {
      id: action.payload.id,
      content_unit_id: action.payload.properties.content_unit_id,
      language: action.payload.properties.language,
    });
    break;
  case FETCH_ITEM_STORAGES_SUCCESS:
    byID = merge(state.byID, {
      id: action.payload.id,
      storages: action.payload.data.map(x => x.id),
    });
    break;
  case FETCH_TREE_WITH_OPERATIONS_SUCCESS:
    byID = bulkMerge(state.byID, action.payload.files);
    byID = merge(byID, {
      id: action.payload.id,
      tree: action.payload.files.map(x => x.id),
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
  byID: bulkMerge(state.byID, action.payload)
});

export const reducer = handleActions({
  [FETCH_ITEM]: onRequest,
  [FETCH_ITEM_SUCCESS]: onSuccess,
  [FETCH_ITEM_FAILURE]: onFailure,
  [FETCH_ITEM_STORAGES]: onRequest,
  [FETCH_ITEM_STORAGES_SUCCESS]: onSuccess,
  [FETCH_ITEM_STORAGES_FAILURE]: onFailure,
  [FETCH_TREE_WITH_OPERATIONS]: onRequest,
  [FETCH_TREE_WITH_OPERATIONS_SUCCESS]: onSuccess,
  [FETCH_TREE_WITH_OPERATIONS_FAILURE]: onFailure,

  [CHANGE_SECURITY_LEVEL]: onRequest,
  [CHANGE_SECURITY_LEVEL_SUCCESS]: onSuccess,
  [CHANGE_SECURITY_LEVEL_FAILURE]: onFailure,
  [UPDATE_PROPERTIES]: onRequest,
  [UPDATE_PROPERTIES_SUCCESS]: onSuccess,
  [UPDATE_PROPERTIES_FAILURE]: onFailure,

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
