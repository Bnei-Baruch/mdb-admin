import { call, put, takeEvery } from 'redux-saga/effects';

import api from '../helpers/apiClient';
import { actions, types } from '../redux/modules/content_units';
import { actions as files } from '../redux/modules/files';
import { actions as collections } from '../redux/modules/collections';
import { actions as persons } from '../redux/modules/persons';

function* fetchItem(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/content_units/${id}/`);
    yield put(actions.fetchItemSuccess(resp.data));
  } catch (err) {
    yield put(actions.fetchItemFailure(err));
  }
}

function* fetchItemFiles(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/content_units/${id}/files/`);
    yield put(files.receiveItems(resp.data));
    yield put(actions.fetchItemFilesSuccess({ id, data: resp.data }));
  } catch (err) {
    yield put(actions.fetchItemFilesFailure(err));
  }
}

function* fetchItemCollections(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/content_units/${id}/collections/`);
    yield put(collections.receiveItems(resp.data.map(x => x.collection)));
    yield put(actions.fetchItemCollectionsSuccess({ id, data: resp.data }));
  } catch (err) {
    yield put(actions.fetchItemCollectionsFailure(err));
  }
}

function* fetchItemDerivatives(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/content_units/${id}/derivatives/`);
    yield put(actions.receiveItems(resp.data.map(x => x.derived)));
    yield put(actions.fetchItemDerivativesSuccess({ id, data: resp.data }));
  } catch (err) {
    yield put(actions.fetchItemDerivativesFailure(err));
  }
}

function* addItemDerivatives(action) {
  try {
    const { id, duID } = action.payload;
    yield call(api.post, `/content_units/${parseInt(id, 10)}/derivatives/`, { derived_id: duID, name: '' });
    yield put(actions.addItemDerivativesSuccess(action.payload));
  } catch (err) {
    yield put(actions.addItemDerivativesFailure(err));
  }
}

function* updateItemDerivatives(action) {
  try {
    const { id, duID, params } = action.payload;
    yield call(api.put, `/content_units/${parseInt(id, 10)}/derivatives/${duID}`, params);
    yield put(actions.updateItemDerivativesSuccess(action.payload));
  } catch (err) {
    yield put(actions.updateItemDerivativesFailure(err));
  }
}

function* removeItemDerivatives(action) {
  try {
    const { id, duID } = action.payload;
    yield call(api.delete, `/content_units/${parseInt(id, 10)}/derivatives/${duID}`);
    yield put(actions.removeItemDerivativesSuccess(action.payload));
  } catch (err) {
    yield put(actions.removeItemDerivativesFailure(err));
  }
}

function* fetchItemOrigins(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/content_units/${id}/origins/`);
    yield put(actions.receiveItems(resp.data.map(x => x.source)));
    yield put(actions.fetchItemOriginsSuccess({ id, data: resp.data }));
  } catch (err) {
    yield put(actions.fetchItemOriginsFailure(err));
  }
}

function* fetchItemSources(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/content_units/${id}/sources/`);
    yield put(actions.fetchItemSourcesSuccess({ id, data: resp.data }));
  } catch (err) {
    yield put(actions.fetchItemSourcesFailure(err));
  }
}

function* fetchItemTags(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/content_units/${id}/tags/`);
    yield put(actions.fetchItemTagsSuccess({ id, data: resp.data }));
  } catch (err) {
    yield put(actions.fetchItemTagsFailure(err));
  }
}

function* fetchItemPersons(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/content_units/${id}/persons/`);
    yield put(persons.receiveItems(resp.data.map(x => x.person)));
    yield put(actions.fetchItemPersonsSuccess({ id, data: resp.data }));
  } catch (err) {
    yield put(actions.fetchItemPersonsFailure(err));
  }
}

function* create(action) {
  try {
    const resp = yield call(api.post, '/content_units/', action.payload);
    yield put(actions.createSuccess(resp.data));
  } catch (err) {
    yield put(actions.createFailure(err));
  }
}

function* updateProperties(action) {
  try {
    const { id, properties } = action.payload;
    const resp               = yield call(api.put, `/content_units/${id}/`, { properties });
    yield put(actions.updatePropertiesSuccess(resp.data));
  } catch (err) {
    yield put(actions.updatePropertiesFailure(err));
  }
}

function* changeSecurityLevel(action) {
  try {
    const { id, level } = action.payload;
    const resp          = yield call(api.put, `/content_units/${id}/`, { secure: level });
    yield put(actions.changeSecurityLevelSuccess(resp.data));
  } catch (err) {
    yield put(actions.changeSecurityLevelFailure(err));
  }
}

function* updateI18n(action) {
  try {
    const { id, i18n } = action.payload;
    const resp         = yield call(api.put, `/content_units/${id}/i18n/`, i18n);
    yield put(actions.updateI18nSuccess(resp.data));
  } catch (err) {
    yield put(actions.updateI18nFailure(err));
  }
}

function* addSource(action) {
  try {
    const { id, sourceID } = action.payload;
    yield call(api.post, `/content_units/${id}/sources/`, { sourceID });
    yield put(actions.addSourceSuccess(action.payload));
  } catch (err) {
    yield put(actions.addSourceFailure(err));
  }
}

function* removeSource(action) {
  try {
    const { id, sourceID } = action.payload;
    yield call(api.delete, `/content_units/${id}/sources/${sourceID}`);
    yield put(actions.removeSourceSuccess(action.payload));
  } catch (err) {
    yield put(actions.removeSourceFailure(err));
  }
}

function* addFiles(action) {
  try {
    const { id, filesIds } = action.payload;
    yield call(api.post, `/content_units/${id}/files/`, filesIds);
    yield put(actions.addFilesSuccess(action.payload));
  } catch (err) {
    yield put(actions.addFilesFailure(err));
  }
}

function* addTag(action) {
  try {
    const { id, tagID } = action.payload;
    yield call(api.post, `/content_units/${id}/tags/`, { tagID });
    yield put(actions.addTagSuccess(action.payload));
  } catch (err) {
    yield put(actions.addTagFailure(err));
  }
}

function* removeTag(action) {
  try {
    const { id, tagID } = action.payload;
    yield call(api.delete, `/content_units/${id}/tags/${tagID}`);
    yield put(actions.removeTagSuccess(action.payload));
  } catch (err) {
    yield put(actions.removeTagFailure(err));
  }
}

function* addPerson(action) {
  try {
    const { id, personID } = action.payload;
    yield call(api.post, `/content_units/${id}/persons/`, { person_id: personID, role_id: 1 });
    yield put(actions.addPersonSuccess(action.payload));
  } catch (err) {
    yield put(actions.addPersonFailure(err));
  }
}

function* removePerson(action) {
  try {
    const { id, personID } = action.payload;
    yield call(api.delete, `/content_units/${id}/persons/${personID}`);
    yield put(actions.removePersonSuccess(action.payload));
  } catch (err) {
    yield put(actions.removePersonFailure(err));
  }
}

function* mergeUnits(action) {
  try {
    const { id, cuIds } = action.payload;
    yield call(api.post, `/content_units/${id}/merge`, cuIds);
    yield put(actions.mergeUnitsSuccess(action.payload));
  } catch (err) {
    yield put(actions.mergeUnitsFailure(err));
  }
}

function* watchFetchItem() {
  yield takeEvery(types.FETCH_ITEM, fetchItem);
}

function* watchFetchItemFiles() {
  yield takeEvery(types.FETCH_ITEM_FILES, fetchItemFiles);
}

function* watchFetchItemCollections() {
  yield takeEvery(types.FETCH_ITEM_COLLECTIONS, fetchItemCollections);
}

function* watchFetchItemDerivatives() {
  yield takeEvery(types.FETCH_ITEM_DERIVATIVES, fetchItemDerivatives);
}

function* watchAddItemDerivatives() {
  yield takeEvery(types.ADD_ITEM_DERIVATIVES, addItemDerivatives);
}

function* watchUpdateItemDerivatives() {
  yield takeEvery(types.UPDATE_ITEM_DERIVATIVES, updateItemDerivatives);
}

function* watchRemoveItemDerivatives() {
  yield takeEvery(types.REMOVE_ITEM_DERIVATIVES, removeItemDerivatives);
}

function* watchFetchItemOrigins() {
  yield takeEvery(types.FETCH_ITEM_ORIGINS, fetchItemOrigins);
}

function* watchFetchItemSources() {
  yield takeEvery(types.FETCH_ITEM_SOURCES, fetchItemSources);
}

function* watchFetchItemTags() {
  yield takeEvery(types.FETCH_ITEM_TAGS, fetchItemTags);
}

function* watchFetchItemPersons() {
  yield takeEvery(types.FETCH_ITEM_PERSONS, fetchItemPersons);
}

function* watchCreate() {
  yield takeEvery(types.CREATE, create);
}

function* watchUpdateProperties() {
  yield takeEvery(types.UPDATE_PROPERTIES, updateProperties);
}

function* watchChangeSecurityLevel() {
  yield takeEvery(types.CHANGE_SECURITY_LEVEL, changeSecurityLevel);
}

function* watchUpdateI18n() {
  yield takeEvery(types.UPDATE_I18N, updateI18n);
}

function* watchAddSource() {
  yield takeEvery(types.ADD_SOURCE, addSource);
}

function* watchRemoveSource() {
  yield takeEvery(types.REMOVE_SOURCE, removeSource);
}

function* watchAddFiles() {
  yield takeEvery(types.ADD_FILES, addFiles);
}

function* watchAddTag() {
  yield takeEvery(types.ADD_TAG, addTag);
}

function* watchRemoveTag() {
  yield takeEvery(types.REMOVE_TAG, removeTag);
}

function* watchAddPerson() {
  yield takeEvery(types.ADD_PERSON, addPerson);
}

function* watchRemovePerson() {
  yield takeEvery(types.REMOVE_PERSON, removePerson);
}

function* watchMergeUnits() {
  yield takeEvery(types.MERGE_UNITS, mergeUnits);
}

export const sagas = [
  watchFetchItem,
  watchFetchItemFiles,
  watchFetchItemCollections,
  watchFetchItemDerivatives,
  watchAddItemDerivatives,
  watchUpdateItemDerivatives,
  watchRemoveItemDerivatives,
  watchFetchItemOrigins,
  watchFetchItemSources,
  watchFetchItemTags,
  watchFetchItemPersons,
  watchCreate,
  watchUpdateProperties,
  watchChangeSecurityLevel,
  watchUpdateI18n,
  watchAddSource,
  watchRemoveSource,
  watchAddFiles,
  watchAddTag,
  watchRemoveTag,
  watchAddPerson,
  watchRemovePerson,
  watchMergeUnits
];
