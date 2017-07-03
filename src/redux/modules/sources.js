import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import memoize from 'lodash/memoize';

import { merge, setMap } from '../utils';
import { buildHierarchy, extractI18n } from '../../helpers/utils';

/* Types */

const FETCH_ITEM         = 'Sources/FETCH_ITEM';
const FETCH_ITEM_SUCCESS = 'Sources/FETCH_ITEM_SUCCESS';
const FETCH_ITEM_FAILURE = 'Sources/FETCH_ITEM_FAILURE';
const FETCH_ALL          = 'Sources/FETCH_ALL';
const FETCH_ALL_SUCCESS  = 'Sources/FETCH_ALL_SUCCESS';
const FETCH_ALL_FAILURE  = 'Sources/FETCH_ALL_FAILURE';

const UPDATE_INFO         = 'Sources/UPDATE_INFO';
const UPDATE_INFO_SUCCESS = 'Sources/UPDATE_INFO_SUCCESS';
const UPDATE_INFO_FAILURE = 'Sources/UPDATE_INFO_FAILURE';
const UPDATE_I18N         = 'Sources/UPDATE_I18N';
const UPDATE_I18N_SUCCESS = 'Sources/UPDATE_I18N_SUCCESS';
const UPDATE_I18N_FAILURE = 'Sources/UPDATE_I18N_FAILURE';
const CREATE              = 'Sources/CREATE';
const CREATE_SUCCESS      = 'Sources/CREATE_SUCCESS';
const CREATE_FAILURE      = 'Sources/CREATE_FAILURE';

export const types = {
  FETCH_ITEM,
  FETCH_ITEM_SUCCESS,
  FETCH_ITEM_FAILURE,
  FETCH_ALL,
  FETCH_ALL_SUCCESS,
  FETCH_ALL_FAILURE,

  UPDATE_INFO,
  UPDATE_INFO_SUCCESS,
  UPDATE_INFO_FAILURE,
  UPDATE_I18N,
  UPDATE_I18N_SUCCESS,
  UPDATE_I18N_FAILURE,
  CREATE,
  CREATE_SUCCESS,
  CREATE_FAILURE,
};

/* Actions */

const fetchItem        = createAction(FETCH_ITEM);
const fetchItemSuccess = createAction(FETCH_ITEM_SUCCESS);
const fetchItemFailure = createAction(FETCH_ITEM_FAILURE);
const fetchAll         = createAction(FETCH_ALL);
const fetchAllSuccess  = createAction(FETCH_ALL_SUCCESS);
const fetchAllFailure  = createAction(FETCH_ALL_FAILURE);

const updateInfo        = createAction(UPDATE_INFO,
  (id, pattern, description, typeID) => ({ id, pattern, description, type_id: typeID }));
const updateInfoSuccess = createAction(UPDATE_INFO_SUCCESS);
const updateInfoFailure = createAction(UPDATE_INFO_FAILURE);
const updateI18n        = createAction(UPDATE_I18N,
  (id, i18n) => ({ id, i18n }));
const updateI18nSuccess = createAction(UPDATE_I18N_SUCCESS);
const updateI18nFailure = createAction(UPDATE_I18N_FAILURE);
const create            = createAction(CREATE,
  (parentID, pattern, description, i18n, author, typeID) => ({
    parent_id: parentID,
    pattern,
    description,
    i18n,
    author,
    type_id: typeID
  }));
const createSuccess     = createAction(CREATE_SUCCESS, (source, author) => ({ source, author }));
const createFailure     = createAction(CREATE_FAILURE);

export const actions = {
  fetchItem,
  fetchItemSuccess,
  fetchItemFailure,
  fetchAll,
  fetchAllSuccess,
  fetchAllFailure,

  updateInfo,
  updateInfoSuccess,
  updateInfoFailure,
  updateI18n,
  updateI18nSuccess,
  updateI18nFailure,
  create,
  createSuccess,
  createFailure,
};

/* Reducer */

const keys = new Map([
  [FETCH_ITEM, 'fetchItem'],
  [FETCH_ITEM_SUCCESS, 'fetchItem'],
  [FETCH_ITEM_FAILURE, 'fetchItem'],
  [FETCH_ALL, 'fetchAll'],
  [FETCH_ALL_SUCCESS, 'fetchAll'],
  [FETCH_ALL_FAILURE, 'fetchAll'],

  [UPDATE_INFO, 'updateInfo'],
  [UPDATE_INFO_SUCCESS, 'updateInfo'],
  [UPDATE_INFO_FAILURE, 'updateInfo'],
  [UPDATE_I18N, 'updateI18n'],
  [UPDATE_I18N_SUCCESS, 'updateI18n'],
  [UPDATE_I18N_FAILURE, 'updateI18n'],
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
  case FETCH_ITEM_SUCCESS:
  case UPDATE_INFO_SUCCESS:
  case UPDATE_I18N_SUCCESS:
  case CREATE_SUCCESS:
    byID = merge(state.byID, action.payload);
    break;
  case FETCH_ALL_SUCCESS:
    byID = new Map(action.payload.map(x => [x.id, x]));
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

  [FETCH_ALL]: onRequest,
  [FETCH_ALL_SUCCESS]: onSuccess,
  [FETCH_ALL_FAILURE]: onFailure,

  [UPDATE_INFO]: onRequest,
  [UPDATE_INFO_SUCCESS]: onSuccess,
  [UPDATE_INFO_FAILURE]: onFailure,

  [UPDATE_I18N]: onRequest,
  [UPDATE_I18N_SUCCESS]: onSuccess,
  [UPDATE_I18N_FAILURE]: onFailure,

  [CREATE]: onRequest,
  [CREATE_SUCCESS]: onSuccess,
  [CREATE_FAILURE]: onFailure,

}, initialState);

/* Selectors */

const sortHierarchy = (h, getById) => {
  console.log('COMPUTE: sortHierarchy ', h.childMap.size);
  h.childMap.forEach((v) => {
    v.sort((a, b) => {
      const sA = getById(a);
      const sB = getById(b);
      if (sA.position !== sB.position) {
        return sA.position - sB.position;
      }

      const aName = extractI18n(sA.i18n, ['name'])[0];
      const bName = extractI18n(sB.i18n, ['name'])[0];

      if (aName < bName) {
        return -1;
      }
      if (aName > bName) {
        return 1;
      }
      return 0;
    });
  });

  return h;
};

const getSources    = state => state.byID;
const getSourceById = state => id => state.byID.get(id);
const getWIP      = state => key => state.wip.get(key);
const getError    = state => key => state.errors.get(key);

const getHierarchy = createSelector(getSources,
  sources => sortHierarchy(buildHierarchy(sources), x => sources.get(x)));

const denormIDs = createSelector(getSources, byID =>
  memoize(ids => ids.map(id => byID.get(id))));

const getPathByID = createSelector(getSources, byID =>
  memoize((id) => {
    const source = byID.get(id);
    const path   = [source];

    let x = source;
    while (x && x.parent_id) {
      x = byID.get(x.parent_id);
      if (x) {
        path.push(x);
      }
    }

    return path;
  }));

export const selectors = {
  getSourceById,
  getWIP,
  getError,
  getHierarchy,
  denormIDs,
  getPathByID,
};
