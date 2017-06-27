import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import memoize from 'lodash/memoize';
import { bulkMerge, merge, setMap } from '../utils';

/* Types */

const FETCH_ITEM                     = 'ContentUnits/FETCH_ITEM';
const FETCH_ITEM_SUCCESS             = 'ContentUnits/FETCH_ITEM_SUCCESS';
const FETCH_ITEM_FAILURE             = 'ContentUnits/FETCH_ITEM_FAILURE';
const FETCH_ITEM_FILES               = 'ContentUnits/FETCH_ITEM_FILES';
const FETCH_ITEM_FILES_SUCCESS       = 'ContentUnits/FETCH_ITEM_FILES_SUCCESS';
const FETCH_ITEM_FILES_FAILURE       = 'ContentUnits/FETCH_ITEM_FILES_FAILURE';
const FETCH_ITEM_COLLECTIONS         = 'ContentUnits/FETCH_ITEM_COLLECTIONS';
const FETCH_ITEM_COLLECTIONS_SUCCESS = 'ContentUnits/FETCH_ITEM_COLLECTIONS_SUCCESS';
const FETCH_ITEM_COLLECTIONS_FAILURE = 'ContentUnits/FETCH_ITEM_COLLECTIONS_FAILURE';
const FETCH_ITEM_SOURCES             = 'ContentUnits/FETCH_ITEM_SOURCES';
const FETCH_ITEM_SOURCES_SUCCESS     = 'ContentUnits/FETCH_ITEM_SOURCES_SUCCESS';
const FETCH_ITEM_SOURCES_FAILURE     = 'ContentUnits/FETCH_ITEM_SOURCES_FAILURE';
const FETCH_ITEM_TAGS                = 'ContentUnits/FETCH_ITEM_TAGS';
const FETCH_ITEM_TAGS_SUCCESS        = 'ContentUnits/FETCH_ITEM_TAGS_SUCCESS';
const FETCH_ITEM_TAGS_FAILURE        = 'ContentUnits/FETCH_ITEM_TAGS_FAILURE';

const CHANGE_SECURITY_LEVEL         = 'ContentUnits/CHANGE_SECURITY_LEVEL';
const CHANGE_SECURITY_LEVEL_SUCCESS = 'ContentUnits/CHANGE_SECURITY_LEVEL_SUCCESS';
const CHANGE_SECURITY_LEVEL_FAILURE = 'ContentUnits/CHANGE_SECURITY_LEVEL_FAILURE';
const UPDATE_I18N                   = 'ContentUnits/UPDATE_I18N';
const UPDATE_I18N_SUCCESS           = 'ContentUnits/UPDATE_I18N_SUCCESS';
const UPDATE_I18N_FAILURE           = 'ContentUnits/UPDATE_I18N_FAILURE';

const RECEIVE_ITEMS = 'ContentUnits/RECEIVE_ITEMS';

export const types = {
  FETCH_ITEM,
  FETCH_ITEM_SUCCESS,
  FETCH_ITEM_FAILURE,
  FETCH_ITEM_FILES,
  FETCH_ITEM_FILES_SUCCESS,
  FETCH_ITEM_FILES_FAILURE,
  FETCH_ITEM_COLLECTIONS,
  FETCH_ITEM_COLLECTIONS_SUCCESS,
  FETCH_ITEM_COLLECTIONS_FAILURE,
  FETCH_ITEM_SOURCES,
  FETCH_ITEM_SOURCES_SUCCESS,
  FETCH_ITEM_SOURCES_FAILURE,
  FETCH_ITEM_TAGS,
  FETCH_ITEM_TAGS_SUCCESS,
  FETCH_ITEM_TAGS_FAILURE,

  CHANGE_SECURITY_LEVEL,
  CHANGE_SECURITY_LEVEL_SUCCESS,
  CHANGE_SECURITY_LEVEL_FAILURE,
  UPDATE_I18N,
  UPDATE_I18N_SUCCESS,
  UPDATE_I18N_FAILURE,

  RECEIVE_ITEMS,
};

/* Actions */

const fetchItem                   = createAction(FETCH_ITEM);
const fetchItemSuccess            = createAction(FETCH_ITEM_SUCCESS);
const fetchItemFailure            = createAction(FETCH_ITEM_FAILURE);
const fetchItemFiles              = createAction(FETCH_ITEM_FILES);
const fetchItemFilesSuccess       = createAction(FETCH_ITEM_FILES_SUCCESS);
const fetchItemFilesFailure       = createAction(FETCH_ITEM_FILES_FAILURE);
const fetchItemCollections        = createAction(FETCH_ITEM_COLLECTIONS);
const fetchItemCollectionsSuccess = createAction(FETCH_ITEM_COLLECTIONS_SUCCESS);
const fetchItemCollectionsFailure = createAction(FETCH_ITEM_COLLECTIONS_FAILURE);
const fetchItemSources            = createAction(FETCH_ITEM_SOURCES);
const fetchItemSourcesSuccess     = createAction(FETCH_ITEM_SOURCES_SUCCESS);
const fetchItemSourcesFailure     = createAction(FETCH_ITEM_SOURCES_FAILURE);
const fetchItemTags               = createAction(FETCH_ITEM_TAGS);
const fetchItemTagsSuccess        = createAction(FETCH_ITEM_TAGS_SUCCESS);
const fetchItemTagsFailure        = createAction(FETCH_ITEM_TAGS_FAILURE);

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
  fetchItemFiles,
  fetchItemFilesSuccess,
  fetchItemFilesFailure,
  fetchItemCollections,
  fetchItemCollectionsSuccess,
  fetchItemCollectionsFailure,
  fetchItemSources,
  fetchItemSourcesSuccess,
  fetchItemSourcesFailure,
  fetchItemTags,
  fetchItemTagsSuccess,
  fetchItemTagsFailure,

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
  [FETCH_ITEM_FILES, 'fetchItemFiles'],
  [FETCH_ITEM_FILES_SUCCESS, 'fetchItemFiles'],
  [FETCH_ITEM_FILES_FAILURE, 'fetchItemFiles'],
  [FETCH_ITEM_COLLECTIONS, 'fetchItemCollections'],
  [FETCH_ITEM_COLLECTIONS_SUCCESS, 'fetchItemCollections'],
  [FETCH_ITEM_COLLECTIONS_FAILURE, 'fetchItemCollections'],
  [FETCH_ITEM_SOURCES, 'fetchItemSources'],
  [FETCH_ITEM_SOURCES_SUCCESS, 'fetchItemSources'],
  [FETCH_ITEM_SOURCES_FAILURE, 'fetchItemSources'],
  [FETCH_ITEM_TAGS, 'fetchItemTags'],
  [FETCH_ITEM_TAGS_SUCCESS, 'fetchItemTags'],
  [FETCH_ITEM_TAGS_FAILURE, 'fetchItemTags'],

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
  case FETCH_ITEM_FILES_SUCCESS:
    byID = merge(state.byID, {
      id: action.payload.id,
      files: action.payload.data.map(x => x.id),
    });
    break;
  case FETCH_ITEM_COLLECTIONS_SUCCESS:
    byID = merge(state.byID, {
      id: action.payload.id,
      collections: action.payload.data.map(x => ({ ...x, collection: x.collection.id })),
    });
    break;
  case FETCH_ITEM_SOURCES_SUCCESS:
    byID = merge(state.byID, {
      id: action.payload.id,
      sources: action.payload.data.map(x => x.id),
    });
    break;
  case FETCH_ITEM_TAGS_SUCCESS:
    byID = merge(state.byID, {
      id: action.payload.id,
      tags: action.payload.data.map(x => x.id),
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
  [FETCH_ITEM_FILES]: onRequest,
  [FETCH_ITEM_FILES_SUCCESS]: onSuccess,
  [FETCH_ITEM_FILES_FAILURE]: onFailure,
  [FETCH_ITEM_COLLECTIONS]: onRequest,
  [FETCH_ITEM_COLLECTIONS_SUCCESS]: onSuccess,
  [FETCH_ITEM_COLLECTIONS_FAILURE]: onFailure,
  [FETCH_ITEM_SOURCES]: onRequest,
  [FETCH_ITEM_SOURCES_SUCCESS]: onSuccess,
  [FETCH_ITEM_SOURCES_FAILURE]: onFailure,
  [FETCH_ITEM_TAGS]: onRequest,
  [FETCH_ITEM_TAGS_SUCCESS]: onSuccess,
  [FETCH_ITEM_TAGS_FAILURE]: onFailure,

  [CHANGE_SECURITY_LEVEL]: onRequest,
  [CHANGE_SECURITY_LEVEL_SUCCESS]: onSuccess,
  [CHANGE_SECURITY_LEVEL_FAILURE]: onFailure,
  [UPDATE_I18N]: onRequest,
  [UPDATE_I18N_SUCCESS]: onSuccess,
  [UPDATE_I18N_FAILURE]: onFailure,

  [RECEIVE_ITEMS]: onReceiveItems,
}, initialState);

/* Selectors */

const getUnits           = state => state.byID;
const denormCCUs            = createSelector(getUnits, byID =>
  memoize(ccus => ccus.map(x => ({ ...x, content_unit: byID.get(x.content_unit_id) }))));
const getContentUnitById = state => id => state.byID.get(id);
const getWIP             = state => key => state.wip.get(key);
const getError           = state => key => state.errors.get(key);

export const selectors = {
  denormCCUs,
  getContentUnitById,
  getWIP,
  getError,
};
