import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { USER_FOUND } from 'redux-oidc';

import { actions, types } from '../redux/modules/tags';
import api from '../helpers/apiClient';
import { loadAllPages } from './utils';

function* fetchItem(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/rest/tags/${id}/`);
    yield put(actions.fetchItemSuccess(resp.data));
  } catch (err) {
    yield put(actions.fetchItemFailure(err));
  }
}

function* fetchAll(action) {
  try {
    const data = yield loadAllPages('/rest/tags/');
    yield put(actions.fetchAllSuccess(data));
  } catch (err) {
    yield put(actions.fetchAllFailure(err));
  }
}

function* updateInfo(action) {
  try {
    const { id, pattern, description } = action.payload;
    const resp                         = yield call(api.put, `/rest/tags/${id}/`, { pattern, description });
    yield put(actions.updateInfoSuccess(resp.data));
  } catch (err) {
    yield put(actions.updateInfoFailure(err));
  }
}

function* updateI18n(action) {
  try {
    const { id, i18n } = action.payload;
    const resp         = yield call(api.put, `/rest/tags/${id}/i18n/`, i18n);
    yield put(actions.updateI18nSuccess(resp.data));
  } catch (err) {
    yield put(actions.updateI18nFailure(err));
  }
}

function* create(action) {
  try {
    const resp = yield call(api.post, '/rest/tags/', action.payload);
    yield put(actions.createSuccess(resp.data));
  } catch (err) {
    yield put(actions.createFailure(err));
  }
}

function* watchFetchItem() {
  yield takeEvery(types.FETCH_ITEM, fetchItem);
}

function* watchLastFetchAll() {
  yield takeLatest([types.FETCH_ALL, USER_FOUND], fetchAll);
}

function* watchUpdateInfo() {
  yield takeEvery(types.UPDATE_INFO, updateInfo);
}

function* watchUpdateI18n() {
  yield takeEvery(types.UPDATE_I18N, updateI18n);
}

function* watchCreate() {
  yield takeEvery(types.CREATE, create);
}

export const sagas = [
  watchFetchItem,
  watchLastFetchAll,
  watchUpdateInfo,
  watchUpdateI18n,
  watchCreate,
];
