import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import memoize from 'lodash/memoize';

import { bulkMerge, merge, setMap, update, delList } from '../utils';

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
const FETCH_ITEM_DERIVATIVES         = 'ContentUnits/FETCH_ITEM_DERIVATIVES';
const FETCH_ITEM_DERIVATIVES_SUCCESS = 'ContentUnits/FETCH_ITEM_DERIVATIVES_SUCCESS';
const FETCH_ITEM_DERIVATIVES_FAILURE = 'ContentUnits/FETCH_ITEM_DERIVATIVES_FAILURE';
const FETCH_ITEM_ORIGINS             = 'ContentUnits/FETCH_ITEM_ORIGINS';
const FETCH_ITEM_ORIGINS_SUCCESS     = 'ContentUnits/FETCH_ITEM_ORIGINS_SUCCESS';
const FETCH_ITEM_ORIGINS_FAILURE     = 'ContentUnits/FETCH_ITEM_ORIGINS_FAILURE';
const FETCH_ITEM_SOURCES             = 'ContentUnits/FETCH_ITEM_SOURCES';
const FETCH_ITEM_SOURCES_SUCCESS     = 'ContentUnits/FETCH_ITEM_SOURCES_SUCCESS';
const FETCH_ITEM_SOURCES_FAILURE     = 'ContentUnits/FETCH_ITEM_SOURCES_FAILURE';
const FETCH_ITEM_TAGS                = 'ContentUnits/FETCH_ITEM_TAGS';
const FETCH_ITEM_TAGS_SUCCESS        = 'ContentUnits/FETCH_ITEM_TAGS_SUCCESS';
const FETCH_ITEM_TAGS_FAILURE        = 'ContentUnits/FETCH_ITEM_TAGS_FAILURE';
const FETCH_ITEM_PERSONS             = 'ContentUnits/FETCH_ITEM_PERSONS';
const FETCH_ITEM_PERSONS_SUCCESS     = 'ContentUnits/FETCH_ITEM_PERSONS_SUCCESS';
const FETCH_ITEM_PERSONS_FAILURE     = 'ContentUnits/FETCH_ITEM_PERSONS_FAILURE';

const CREATE                        = 'ContentUnits/CREATE';
const CREATE_SUCCESS                = 'ContentUnits/CREATE_SUCCESS';
const CREATE_FAILURE                = 'ContentUnits/CREATE_FAILURE';
const UPDATE_PROPERTIES             = 'ContentUnits/UPDATE_PROPERTIES';
const UPDATE_PROPERTIES_SUCCESS     = 'ContentUnits/UPDATE_PROPERTIES_SUCCESS';
const UPDATE_PROPERTIES_FAILURE     = 'ContentUnits/UPDATE_PROPERTIES_FAILURE';
const CHANGE_SECURITY_LEVEL         = 'ContentUnits/CHANGE_SECURITY_LEVEL';
const CHANGE_SECURITY_LEVEL_SUCCESS = 'ContentUnits/CHANGE_SECURITY_LEVEL_SUCCESS';
const CHANGE_SECURITY_LEVEL_FAILURE = 'ContentUnits/CHANGE_SECURITY_LEVEL_FAILURE';
const UPDATE_I18N                   = 'ContentUnits/UPDATE_I18N';
const UPDATE_I18N_SUCCESS           = 'ContentUnits/UPDATE_I18N_SUCCESS';
const UPDATE_I18N_FAILURE           = 'ContentUnits/UPDATE_I18N_FAILURE';
const ADD_SOURCE                    = 'ContentUnits/ADD_SOURCE';
const ADD_SOURCE_SUCCESS            = 'ContentUnits/ADD_SOURCE_SUCCESS';
const ADD_SOURCE_FAILURE            = 'ContentUnits/ADD_SOURCE_FAILURE';
const REMOVE_SOURCE                 = 'ContentUnits/REMOVE_SOURCE';
const REMOVE_SOURCE_SUCCESS         = 'ContentUnits/REMOVE_SOURCE_SUCCESS';
const REMOVE_SOURCE_FAILURE         = 'ContentUnits/REMOVE_SOURCE_FAILURE';
const ADD_FILES                     = 'ContentUnits/ADD_FILES';
const ADD_FILES_SUCCESS             = 'ContentUnits/ADD_FILES_SUCCESS';
const ADD_FILES_FAILURE             = 'ContentUnits/ADD_FILES_FAILURE';
const ADD_TAG                       = 'ContentUnits/ADD_TAG';
const ADD_TAG_SUCCESS               = 'ContentUnits/ADD_TAG_SUCCESS';
const ADD_TAG_FAILURE               = 'ContentUnits/ADD_TAG_FAILURE';
const REMOVE_TAG                    = 'ContentUnits/REMOVE_TAG';
const REMOVE_TAG_SUCCESS            = 'ContentUnits/REMOVE_TAG_SUCCESS';
const REMOVE_TAG_FAILURE            = 'ContentUnits/REMOVE_TAG_FAILURE';
const ADD_PERSON                    = 'ContentUnits/ADD_PERSON';
const ADD_PERSON_SUCCESS            = 'ContentUnits/ADD_PERSON_SUCCESS';
const ADD_PERSON_FAILURE            = 'ContentUnits/ADD_PERSON_FAILURE';
const REMOVE_PERSON                 = 'ContentUnits/REMOVE_PERSON';
const REMOVE_PERSON_SUCCESS         = 'ContentUnits/REMOVE_PERSON_SUCCESS';
const REMOVE_PERSON_FAILURE         = 'ContentUnits/REMOVE_PERSON_FAILURE';
const MERGE_UNITS                   = 'ContentUnits/MERGE_UNITS';
const MERGE_UNITS_SUCCESS           = 'ContentUnits/MERGE_UNITS_SUCCESS';
const MERGE_UNITS_FAILURE           = 'ContentUnits/MERGE_UNITS_FAILURE';

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
  FETCH_ITEM_DERIVATIVES,
  FETCH_ITEM_DERIVATIVES_SUCCESS,
  FETCH_ITEM_DERIVATIVES_FAILURE,
  FETCH_ITEM_ORIGINS,
  FETCH_ITEM_ORIGINS_SUCCESS,
  FETCH_ITEM_ORIGINS_FAILURE,
  FETCH_ITEM_SOURCES,
  FETCH_ITEM_SOURCES_SUCCESS,
  FETCH_ITEM_SOURCES_FAILURE,
  FETCH_ITEM_TAGS,
  FETCH_ITEM_TAGS_SUCCESS,
  FETCH_ITEM_TAGS_FAILURE,
  FETCH_ITEM_PERSONS,
  FETCH_ITEM_PERSONS_SUCCESS,
  FETCH_ITEM_PERSONS_FAILURE,

  CREATE,
  CREATE_SUCCESS,
  CREATE_FAILURE,
  CHANGE_SECURITY_LEVEL,
  CHANGE_SECURITY_LEVEL_SUCCESS,
  CHANGE_SECURITY_LEVEL_FAILURE,
  UPDATE_I18N,
  UPDATE_I18N_SUCCESS,
  UPDATE_I18N_FAILURE,
  UPDATE_PROPERTIES,
  UPDATE_PROPERTIES_SUCCESS,
  UPDATE_PROPERTIES_FAILURE,
  ADD_SOURCE,
  ADD_SOURCE_SUCCESS,
  ADD_SOURCE_FAILURE,
  REMOVE_SOURCE,
  REMOVE_SOURCE_SUCCESS,
  REMOVE_SOURCE_FAILURE,
  ADD_FILES,
  ADD_FILES_SUCCESS,
  ADD_FILES_FAILURE,
  ADD_TAG,
  ADD_TAG_SUCCESS,
  ADD_TAG_FAILURE,
  REMOVE_TAG,
  REMOVE_TAG_SUCCESS,
  REMOVE_TAG_FAILURE,
  ADD_PERSON,
  ADD_PERSON_SUCCESS,
  ADD_PERSON_FAILURE,
  REMOVE_PERSON,
  REMOVE_PERSON_SUCCESS,
  REMOVE_PERSON_FAILURE,
  MERGE_UNITS,
  MERGE_UNITS_SUCCESS,
  MERGE_UNITS_FAILURE,

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
const fetchItemDerivatives        = createAction(FETCH_ITEM_DERIVATIVES);
const fetchItemDerivativesSuccess = createAction(FETCH_ITEM_DERIVATIVES_SUCCESS);
const fetchItemDerivativesFailure = createAction(FETCH_ITEM_DERIVATIVES_FAILURE);
const fetchItemOrigins            = createAction(FETCH_ITEM_ORIGINS);
const fetchItemOriginsSuccess     = createAction(FETCH_ITEM_ORIGINS_SUCCESS);
const fetchItemOriginsFailure     = createAction(FETCH_ITEM_ORIGINS_FAILURE);
const fetchItemSources            = createAction(FETCH_ITEM_SOURCES);
const fetchItemSourcesSuccess     = createAction(FETCH_ITEM_SOURCES_SUCCESS);
const fetchItemSourcesFailure     = createAction(FETCH_ITEM_SOURCES_FAILURE);
const fetchItemTags               = createAction(FETCH_ITEM_TAGS);
const fetchItemTagsSuccess        = createAction(FETCH_ITEM_TAGS_SUCCESS);
const fetchItemTagsFailure        = createAction(FETCH_ITEM_TAGS_FAILURE);
const fetchItemPersons            = createAction(FETCH_ITEM_PERSONS);
const fetchItemPersonsSuccess     = createAction(FETCH_ITEM_PERSONS_SUCCESS);
const fetchItemPersonsFailure     = createAction(FETCH_ITEM_PERSONS_FAILURE);

const create                     = createAction(CREATE, (typeID, properties, i18n) => ({
  type_id: typeID,
  properties,
  i18n
}));
const createSuccess              = createAction(CREATE_SUCCESS);
const createFailure              = createAction(CREATE_FAILURE);
const updateProperties           = createAction(UPDATE_PROPERTIES, (id, properties) => ({ id, properties }));
const updatePropertiesSuccess    = createAction(UPDATE_PROPERTIES_SUCCESS);
const updatePropertiesFailure    = createAction(UPDATE_PROPERTIES_FAILURE);
const updateI18n                 = createAction(UPDATE_I18N, (id, i18n) => ({ id, i18n }));
const updateI18nSuccess          = createAction(UPDATE_I18N_SUCCESS);
const updateI18nFailure          = createAction(UPDATE_I18N_FAILURE);
const changeSecurityLevel        = createAction(CHANGE_SECURITY_LEVEL, (id, level) => ({ id, level }));
const changeSecurityLevelSuccess = createAction(CHANGE_SECURITY_LEVEL_SUCCESS);
const changeSecurityLevelFailure = createAction(CHANGE_SECURITY_LEVEL_FAILURE);
const addSource                  = createAction(ADD_SOURCE, (id, sourceID) => ({ id, sourceID }));
const addSourceSuccess           = createAction(ADD_SOURCE_SUCCESS);
const addSourceFailure           = createAction(ADD_SOURCE_FAILURE);
const removeSource               = createAction(REMOVE_SOURCE, (id, sourceID) => ({ id, sourceID }));
const removeSourceSuccess        = createAction(REMOVE_SOURCE_SUCCESS);
const removeSourceFailure        = createAction(REMOVE_SOURCE_FAILURE);
const addFiles                   = createAction(ADD_FILES, (id, filesIds) => ({ id, filesIds }));
const addFilesSuccess            = createAction(ADD_FILES_SUCCESS);
const addFilesFailure            = createAction(ADD_FILES_FAILURE);
const addTag                     = createAction(ADD_TAG, (id, tagID) => ({ id, tagID }));
const addTagSuccess              = createAction(ADD_TAG_SUCCESS);
const addTagFailure              = createAction(ADD_TAG_FAILURE);
const removeTag                  = createAction(REMOVE_TAG, (id, tagID) => ({ id, tagID }));
const removeTagSuccess           = createAction(REMOVE_TAG_SUCCESS);
const removeTagFailure           = createAction(REMOVE_TAG_FAILURE);
const addPerson                  = createAction(ADD_PERSON, (id, personID) => ({ id, personID }));
const addPersonSuccess           = createAction(ADD_PERSON_SUCCESS);
const addPersonFailure           = createAction(ADD_PERSON_FAILURE);
const removePerson               = createAction(REMOVE_PERSON, (id, personID) => ({ id, personID }));
const removePersonSuccess        = createAction(REMOVE_PERSON_SUCCESS);
const removePersonFailure        = createAction(REMOVE_PERSON_FAILURE);
const mergeUnits                 = createAction(MERGE_UNITS, (id, cuIds) => ({ id, cuIds }));
const mergeUnitsSuccess          = createAction(MERGE_UNITS_SUCCESS);
const mergeUnitsFailure          = createAction(MERGE_UNITS_FAILURE);

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
  fetchItemDerivatives,
  fetchItemDerivativesSuccess,
  fetchItemDerivativesFailure,
  fetchItemOrigins,
  fetchItemOriginsSuccess,
  fetchItemOriginsFailure,
  fetchItemSources,
  fetchItemSourcesSuccess,
  fetchItemSourcesFailure,
  fetchItemTags,
  fetchItemTagsSuccess,
  fetchItemTagsFailure,
  fetchItemPersons,
  fetchItemPersonsSuccess,
  fetchItemPersonsFailure,

  create,
  createSuccess,
  createFailure,
  updateProperties,
  updatePropertiesSuccess,
  updatePropertiesFailure,
  updateI18n,
  updateI18nSuccess,
  updateI18nFailure,
  changeSecurityLevel,
  changeSecurityLevelSuccess,
  changeSecurityLevelFailure,
  addSource,
  addSourceSuccess,
  addSourceFailure,
  removeSource,
  removeSourceSuccess,
  removeSourceFailure,
  addFiles,
  addFilesSuccess,
  addFilesFailure,
  addTag,
  addTagSuccess,
  addTagFailure,
  removeTag,
  removeTagSuccess,
  removeTagFailure,
  addPerson,
  addPersonSuccess,
  addPersonFailure,
  removePerson,
  removePersonSuccess,
  removePersonFailure,
  mergeUnits,
  mergeUnitsSuccess,
  mergeUnitsFailure,

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
  [FETCH_ITEM_DERIVATIVES, 'fetchItemDerivatives'],
  [FETCH_ITEM_DERIVATIVES_SUCCESS, 'fetchItemDerivatives'],
  [FETCH_ITEM_DERIVATIVES_FAILURE, 'fetchItemDerivatives'],
  [FETCH_ITEM_ORIGINS, 'fetchItemOrigins'],
  [FETCH_ITEM_ORIGINS_SUCCESS, 'fetchItemOrigins'],
  [FETCH_ITEM_ORIGINS_FAILURE, 'fetchItemOrigins'],
  [FETCH_ITEM_SOURCES, 'fetchItemSources'],
  [FETCH_ITEM_SOURCES_SUCCESS, 'fetchItemSources'],
  [FETCH_ITEM_SOURCES_FAILURE, 'fetchItemSources'],
  [FETCH_ITEM_TAGS, 'fetchItemTags'],
  [FETCH_ITEM_TAGS_SUCCESS, 'fetchItemTags'],
  [FETCH_ITEM_TAGS_FAILURE, 'fetchItemTags'],
  [FETCH_ITEM_PERSONS, 'fetchItemPersons'],
  [FETCH_ITEM_PERSONS_SUCCESS, 'fetchItemPersons'],
  [FETCH_ITEM_PERSONS_FAILURE, 'fetchItemPersons'],

  [CREATE, 'create'],
  [CREATE_SUCCESS, 'create'],
  [CREATE_FAILURE, 'create'],
  [UPDATE_PROPERTIES, 'updateProperties'],
  [UPDATE_PROPERTIES_SUCCESS, 'updateProperties'],
  [UPDATE_PROPERTIES_FAILURE, 'updateProperties'],
  [UPDATE_I18N, 'updateI18n'],
  [UPDATE_I18N_SUCCESS, 'updateI18n'],
  [UPDATE_I18N_FAILURE, 'updateI18n'],
  [CHANGE_SECURITY_LEVEL, 'changeSecurityLevel'],
  [CHANGE_SECURITY_LEVEL_SUCCESS, 'changeSecurityLevel'],
  [CHANGE_SECURITY_LEVEL_FAILURE, 'changeSecurityLevel'],
  [ADD_SOURCE, 'addSource'],
  [ADD_SOURCE_SUCCESS, 'addSource'],
  [ADD_SOURCE_FAILURE, 'addSource'],
  [REMOVE_SOURCE, 'removeSource'],
  [REMOVE_SOURCE_SUCCESS, 'removeSource'],
  [REMOVE_SOURCE_FAILURE, 'removeSource'],
  [ADD_FILES, 'addFiles'],
  [ADD_FILES_SUCCESS, 'addFiles'],
  [ADD_FILES_FAILURE, 'addFiles'],
  [ADD_TAG, 'addTag'],
  [ADD_TAG_SUCCESS, 'addTag'],
  [ADD_TAG_FAILURE, 'addTag'],
  [REMOVE_TAG, 'removeTag'],
  [REMOVE_TAG_SUCCESS, 'removeTag'],
  [REMOVE_TAG_FAILURE, 'removeTag'],
  [ADD_PERSON, 'addPerson'],
  [ADD_PERSON_SUCCESS, 'addPerson'],
  [ADD_PERSON_FAILURE, 'addPerson'],
  [REMOVE_PERSON, 'removePerson'],
  [REMOVE_PERSON_SUCCESS, 'removePerson'],
  [REMOVE_PERSON_FAILURE, 'removePerson'],
  [MERGE_UNITS, 'mergeUnits'],
  [MERGE_UNITS_SUCCESS, 'mergeUnits'],
  [MERGE_UNITS_FAILURE, 'mergeUnits'],
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
  case CREATE:
  case UPDATE_PROPERTIES_SUCCESS:
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
      collections: action.payload.data.map(x => ({ name: x.name, collection_id: x.collection.id })),
    });
    break;
  case FETCH_ITEM_DERIVATIVES_SUCCESS:
    byID = merge(state.byID, {
      id: action.payload.id,
      derivatives: action.payload.data.map(x => ({ name: x.name, content_unit_id: x.derived.id })),
    });
    break;
  case FETCH_ITEM_ORIGINS_SUCCESS:
    byID = merge(state.byID, {
      id: action.payload.id,
      origins: action.payload.data.map(x => ({ name: x.name, content_unit_id: x.source.id })),
    });
    break;
  case FETCH_ITEM_SOURCES_SUCCESS:
    byID = merge(state.byID, {
      id: action.payload.id,
      sources: action.payload.data.map(x => x.id),
    });
    break;
  case ADD_SOURCE_SUCCESS:
    byID = update(state.byID, action.payload.id,
      x => ({ ...x, sources: [...x.sources, action.payload.sourceID] }));
    break;
  case REMOVE_SOURCE_SUCCESS:
    byID = update(state.byID, action.payload.id,
      x => ({ ...x, sources: x.sources.filter(s => s !== action.payload.sourceID) }));
    break;
  case FETCH_ITEM_TAGS_SUCCESS:
    byID = merge(state.byID, {
      id: action.payload.id,
      tags: action.payload.data.map(x => x.id),
    });
    break;
  case ADD_TAG_SUCCESS:
    byID = update(state.byID, action.payload.id,
      x => ({ ...x, tags: [...x.tags, action.payload.tagID] }));
    break;
  case REMOVE_TAG_SUCCESS:
    byID = update(state.byID, action.payload.id,
      x => ({ ...x, tags: x.tags.filter(t => t !== action.payload.tagID) }));
    break;
  case FETCH_ITEM_PERSONS_SUCCESS:
    byID = merge(state.byID, {
      id: action.payload.id,
      persons: action.payload.data.map(x => x.person.id),
    });
    break;
  case ADD_PERSON_SUCCESS:
    byID = update(state.byID, action.payload.id,
      x => ({ ...x, persons: [...x.persons, action.payload.personID] }));
    break;
  case REMOVE_PERSON_SUCCESS:
    byID = update(state.byID, action.payload.id,
      x => ({ ...x, persons: x.persons.filter(t => t !== action.payload.personID) }));
    break;
  case ADD_FILES_SUCCESS:
    byID = update(state.byID, action.payload.id,
      x => ({ ...x, files: [...x.files, ...action.payload.filesIds] }));
    break;
  case MERGE_UNITS_SUCCESS:
    byID = delList(state.byID, action.payload.cuIds);
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
  [FETCH_ITEM_DERIVATIVES]: onRequest,
  [FETCH_ITEM_DERIVATIVES_SUCCESS]: onSuccess,
  [FETCH_ITEM_DERIVATIVES_FAILURE]: onFailure,
  [FETCH_ITEM_ORIGINS]: onRequest,
  [FETCH_ITEM_ORIGINS_SUCCESS]: onSuccess,
  [FETCH_ITEM_ORIGINS_FAILURE]: onFailure,
  [FETCH_ITEM_SOURCES]: onRequest,
  [FETCH_ITEM_SOURCES_SUCCESS]: onSuccess,
  [FETCH_ITEM_SOURCES_FAILURE]: onFailure,
  [FETCH_ITEM_TAGS]: onRequest,
  [FETCH_ITEM_TAGS_SUCCESS]: onSuccess,
  [FETCH_ITEM_TAGS_FAILURE]: onFailure,
  [FETCH_ITEM_PERSONS]: onRequest,
  [FETCH_ITEM_PERSONS_SUCCESS]: onSuccess,
  [FETCH_ITEM_PERSONS_FAILURE]: onFailure,

  [CREATE]: onRequest,
  [CREATE_SUCCESS]: onSuccess,
  [CREATE_FAILURE]: onFailure,
  [UPDATE_PROPERTIES]: onRequest,
  [UPDATE_PROPERTIES_SUCCESS]: onSuccess,
  [UPDATE_PROPERTIES_FAILURE]: onFailure,
  [UPDATE_I18N]: onRequest,
  [UPDATE_I18N_SUCCESS]: onSuccess,
  [UPDATE_I18N_FAILURE]: onFailure,
  [CHANGE_SECURITY_LEVEL]: onRequest,
  [CHANGE_SECURITY_LEVEL_SUCCESS]: onSuccess,
  [CHANGE_SECURITY_LEVEL_FAILURE]: onFailure,
  [ADD_SOURCE]: onRequest,
  [ADD_SOURCE_SUCCESS]: onSuccess,
  [ADD_SOURCE_FAILURE]: onFailure,
  [REMOVE_SOURCE]: onRequest,
  [REMOVE_SOURCE_SUCCESS]: onSuccess,
  [REMOVE_SOURCE_FAILURE]: onFailure,
  [ADD_FILES]: onRequest,
  [ADD_FILES_SUCCESS]: onSuccess,
  [ADD_FILES_FAILURE]: onFailure,
  [ADD_TAG]: onRequest,
  [ADD_TAG_SUCCESS]: onSuccess,
  [ADD_TAG_FAILURE]: onFailure,
  [REMOVE_TAG]: onRequest,
  [REMOVE_TAG_SUCCESS]: onSuccess,
  [REMOVE_TAG_FAILURE]: onFailure,
  [ADD_PERSON]: onRequest,
  [ADD_PERSON_SUCCESS]: onSuccess,
  [ADD_PERSON_FAILURE]: onFailure,
  [REMOVE_PERSON]: onRequest,
  [REMOVE_PERSON_SUCCESS]: onSuccess,
  [REMOVE_PERSON_FAILURE]: onFailure,
  [MERGE_UNITS]: onRequest,
  [MERGE_UNITS_SUCCESS]: onSuccess,
  [MERGE_UNITS_FAILURE]: onFailure,

  [RECEIVE_ITEMS]: onReceiveItems,
}, initialState);

/* Selectors */

const getUnits           = state => state.byID;
const getContentUnitById = (state, id) => state.byID.get(id);
const getWIP             = (state, key) => state.wip.get(key);
const getError           = (state, key) => state.errors.get(key);

const denormIDs = createSelector(getUnits, byID =>
  memoize(ids => ids.map(id => byID.get(id))));

// CCU = CollectionContentUnit
const denormCCUs = createSelector(getUnits, byID =>
  memoize(ccus => ccus.map(x => ({ ...x, content_unit: byID.get(x.content_unit_id) }))));

// CUD = ContentUnitDerivation
const denormCUDs = createSelector(getUnits, byID =>
  memoize(cuds => cuds.map(x => ({ ...x, content_unit: byID.get(x.content_unit_id) }))));

export const selectors = {
  getContentUnitById,
  getWIP,
  getError,
  denormIDs,
  denormCCUs,
  denormCUDs,
};
