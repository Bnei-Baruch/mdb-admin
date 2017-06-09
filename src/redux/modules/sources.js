import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import { buildHierarchy, extractI18n } from '../../helpers/utils';

/* Types */

const FETCH_ITEM          = 'Sources/FETCH_ITEM';
const FETCH_ITEM_SUCCESS  = 'Sources/FETCH_ITEM_SUCCESS';
const FETCH_ITEM_FAILURE  = 'Sources/FETCH_ITEM_FAILURE';
const FETCH_ALL           = 'Sources/FETCH_ALL';
const FETCH_ALL_SUCCESS   = 'Sources/FETCH_ALL_SUCCESS';
const FETCH_ALL_FAILURE   = 'Sources/FETCH_ALL_FAILURE';
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

const fetchItem         = createAction(FETCH_ITEM);
const fetchItemSuccess  = createAction(FETCH_ITEM_SUCCESS);
const fetchItemFailure  = createAction(FETCH_ITEM_FAILURE);
const fetchAll          = createAction(FETCH_ALL);
const fetchAllSuccess   = createAction(FETCH_ALL_SUCCESS);
const fetchAllFailure   = createAction(FETCH_ALL_FAILURE);
const updateInfo        = createAction(UPDATE_INFO,
  (id, pattern, description, type_id) => ({ id, pattern, description, type_id }));
const updateInfoSuccess = createAction(UPDATE_INFO_SUCCESS);
const updateInfoFailure = createAction(UPDATE_INFO_FAILURE);
const updateI18n        = createAction(UPDATE_I18N,
  (id, i18n) => ({ id, i18n }));
const updateI18nSuccess = createAction(UPDATE_I18N_SUCCESS);
const updateI18nFailure = createAction(UPDATE_I18N_FAILURE);
const create            = createAction(CREATE,
  (parent_id, pattern, description, i18n, author, type_id) => ({
    parent_id,
    pattern,
    description,
    i18n,
    author,
    type_id
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

const _keys = new Map([
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
  wip: new Map(Array.from(_keys.values(), x => [x, false])),
  errors: new Map(Array.from(_keys.values(), x => [x, null])),
};

const _setMap = (m, k, v) => {
  const nm = new Map(m);
  nm.set(k, v);
  return nm;
};

const _onRequest = (state, action) => ({
  ...state,
  wip: _setMap(state.wip, _keys.get(action.type), true)
});

const _onFailure = (state, action) => {
  const key = _keys.get(action.type);
  return {
    ...state,
    wip: _setMap(state.wip, key, false),
    errors: _setMap(state.errors, key, action.payload),
  };
};

const _onSuccess = (state, action) => {
  const key = _keys.get(action.type);

  let byID;
  switch (action.type) {
  case FETCH_ITEM_SUCCESS:
  case UPDATE_INFO_SUCCESS:
  case UPDATE_I18N_SUCCESS:
    byID = _setMap(state.byID, action.payload.id, action.payload);
    break;
  case CREATE_SUCCESS: {
    const { source } = action.payload;
    byID             = _setMap(state.byID, source.id, source);
    break;
  }
  case FETCH_ALL_SUCCESS:
    byID = new Map(action.payload.map(x => [x.id, x]));
    break;
  default:
    byID = state.byID;
  }

  return {
    ...state,
    byID,
    wip: _setMap(state.wip, key, false),
    errors: _setMap(state.errors, key, null),
  };
};

export const reducer = handleActions({
  [FETCH_ITEM]: _onRequest,
  [FETCH_ITEM_SUCCESS]: _onSuccess,
  [FETCH_ITEM_FAILURE]: _onFailure,

  [FETCH_ALL]: _onRequest,
  [FETCH_ALL_SUCCESS]: _onSuccess,
  [FETCH_ALL_FAILURE]: _onFailure,

  [UPDATE_INFO]: _onRequest,
  [UPDATE_INFO_SUCCESS]: _onSuccess,
  [UPDATE_INFO_FAILURE]: _onFailure,

  [UPDATE_I18N]: _onRequest,
  [UPDATE_I18N_SUCCESS]: _onSuccess,
  [UPDATE_I18N_FAILURE]: _onFailure,

  [CREATE]: _onRequest,
  [CREATE_SUCCESS]: _onSuccess,
  [CREATE_FAILURE]: _onFailure,

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
const getHierarchy  = createSelector(getSources,
  sources => sortHierarchy(buildHierarchy(sources), x => sources.get(x)));
const getWIP        = state => key => state.wip.get(key);
const getError      = state => key => state.errors.get(key);

export const selectors = {
  getSourceById,
  getHierarchy,
  getWIP,
  getError,
};
