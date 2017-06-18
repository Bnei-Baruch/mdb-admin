import { call, put, takeEvery } from 'redux-saga/effects';

import api from '../helpers/apiClient';
import { actions, types } from '../redux/modules/content_units';
import { actions as files } from '../redux/modules/files';
import { actions as collections } from '../redux/modules/collections';

function* fetchItem(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/rest/content_units/${id}/`);
    yield put(actions.fetchItemSuccess(resp.data));
  } catch (err) {
    yield put(actions.fetchItemFailure(err));
  }
}

function* fetchItemFiles(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/rest/content_units/${id}/files/`);
    yield put(files.receiveItems(resp.data));
    yield put(actions.fetchItemFilesSuccess({ id, data: resp.data }));
  } catch (err) {
    yield put(actions.fetchItemFilesFailure(err));
  }
}

function* fetchItemCollections(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/rest/content_units/${id}/collections/`);
    yield put(collections.receiveItems(resp.data.map(x => x.collection)));
    yield put(actions.fetchItemCollectionsSuccess({ id, data: resp.data }));
  } catch (err) {
    yield put(actions.fetchItemCollectionsFailure(err));
  }
}

function* fetchItemSources(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/rest/content_units/${id}/sources/`);
    yield put(actions.fetchItemSourcesSuccess({ id, data: resp.data }));
  } catch (err) {
    yield put(actions.fetchItemSourcesFailure(err));
  }
}

function* fetchItemTags(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/rest/content_units/${id}/tags/`);
    yield put(actions.fetchItemTagsSuccess({ id, data: resp.data }));
  } catch (err) {
    yield put(actions.fetchItemTagsFailure(err));
  }
}

function* changeSecurityLevel(action) {
  try {
    const { id, level } = action.payload;
    const resp          = yield call(api.put, `/rest/content_units/${id}/`, { secure: level });
    yield put(actions.changeSecurityLevelSuccess(resp.data));
  } catch (err) {
    yield put(actions.changeSecurityLevelFailure(err));
  }
}

function* updateI18n(action) {
  try {
    const { id, i18n } = action.payload;
    const resp         = yield call(api.put, `/rest/content_units/${id}/i18n/`, i18n);
    yield put(actions.updateI18nSuccess(resp.data));
  } catch (err) {
    yield put(actions.updateI18nFailure(err));
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

function* watchFetchItemSources() {
  yield takeEvery(types.FETCH_ITEM_SOURCES, fetchItemSources);
}

function* watchFetchItemTags() {
  yield takeEvery(types.FETCH_ITEM_TAGS, fetchItemTags);
}

function* watchChangeSecurityLevel() {
  yield takeEvery(types.CHANGE_SECURITY_LEVEL, changeSecurityLevel);
}

function* watchUpdateI18n() {
  yield takeEvery(types.UPDATE_I18N, updateI18n);
}

export const sagas = [
  watchFetchItem,
  watchFetchItemFiles,
  watchFetchItemCollections,
  watchFetchItemSources,
  watchFetchItemTags,
  watchChangeSecurityLevel,
  watchUpdateI18n,
];
