import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import memoize from 'lodash/memoize';

import { setMap, merge, bulkMerge } from '../utils';

/* Types */

const FETCH_ITEM         = 'Persons/FETCH_ITEM';
const FETCH_ITEM_SUCCESS = 'Persons/FETCH_ITEM_SUCCESS';
const FETCH_ITEM_FAILURE = 'Persons/FETCH_ITEM_FAILURE';
const CREATE             = 'Persons/CREATE';
const CREATE_SUCCESS     = 'Persons/CREATE_SUCCESS';
const CREATE_FAILURE     = 'Persons/CREATE_FAILURE';
const RECEIVE_ITEMS      = 'ContentUnits/RECEIVE_ITEMS';

export const types = {
  FETCH_ITEM,
  FETCH_ITEM_SUCCESS,
  FETCH_ITEM_FAILURE,
  CREATE,
  CREATE_SUCCESS,
  CREATE_FAILURE,

  RECEIVE_ITEMS,
};

/* Actions */

const fetchItem        = createAction(FETCH_ITEM);
const fetchItemSuccess = createAction(FETCH_ITEM_SUCCESS);
const fetchItemFailure = createAction(FETCH_ITEM_FAILURE);
const create           = createAction(CREATE, (typeID, properties, i18n) => ({
  type_id: typeID,
  properties,
  i18n
}));
const createSuccess    = createAction(CREATE_SUCCESS);
const createFailure    = createAction(CREATE_FAILURE);

const receiveItems = createAction(RECEIVE_ITEMS);

export const actions = {
  fetchItem,
  fetchItemSuccess,
  fetchItemFailure,
  create,
  createSuccess,
  createFailure,

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
