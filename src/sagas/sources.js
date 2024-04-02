import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';

import { actions, types } from '../redux/modules/sources';
import { actions as actionsAuthor } from '../redux/modules/authors';
import api from '../helpers/apiClient';
import { loadAllPages } from './utils';

function* fetchItem(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/sources/${id}/`);
    yield put(actions.fetchItemSuccess(resp.data));
  } catch (err) {
    yield put(actions.fetchItemFailure(err));
  }
}

function* fetchAll() {
  try {
    const data = yield loadAllPages('/sources/');
    yield put(actions.fetchAllSuccess(data));
  } catch (err) {
    yield put(actions.fetchAllFailure(err));
  }
}

function* updateInfo(action) {
  try {
    const { id, pattern, description, type_id, position } = action.payload;

    const params = { pattern, description, type_id };
    if (position) params.position = position;
    const resp = yield call(api.put, `/sources/${id}/`, params);
    yield put(actions.updateInfoSuccess(resp.data));
  } catch (err) {
    yield put(actions.updateInfoFailure(err));
  }
}

function* updateI18n(action) {
  try {
    const { id, i18n } = action.payload;
    const resp         = yield call(api.put, `/sources/${id}/i18n/`, i18n);
    yield put(actions.updateI18nSuccess(resp.data));
  } catch (err) {
    yield put(actions.updateI18nFailure(err));
  }
}

function* create(action) {
  try {
    const resp = yield call(api.post, '/sources/', action.payload);
    yield put(actions.createSuccess(resp.data));
    if (action.payload.author) {
      yield put(actionsAuthor.onNewSourceSuccess(resp.data, action.payload.author));
    }
  } catch (err) {
    yield put(actions.createFailure(err));
  }
}

function* watchFetchItem() {
  yield takeEvery(types.FETCH_ITEM, fetchItem);
}

function* watchLastFetchAll() {
  yield takeLatest(types.FETCH_ALL, fetchAll);
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
