import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';

import { actions, types } from '../redux/modules/persons';
import { types as system } from '../redux/modules/system';
import api from '../helpers/apiClient';
import { loadAllPages } from './utils';

function* fetchItem(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/rest/persons/${id}/`);
    yield put(actions.fetchItemSuccess(resp.data));
  } catch (err) {
    yield put(actions.fetchItemFailure(err));
  }
}

function* fetchAll(action) {
  try {
    const data = yield loadAllPages('/rest/persons/');
    yield put(actions.fetchAllSuccess(data));
  } catch (err) {
    yield put(actions.fetchAllFailure(err));
  }
}

function* create(action) {
  try {
    const resp = yield call(api.post, '/rest/persons/', action.payload);
    yield put(actions.createSuccess(resp.data, action.payload.author));
  } catch (err) {
    yield put(actions.createFailure(err));
  }
}

function* updateInfo(action) {
  try {
    const { id, pattern } = action.payload;
    const resp            = yield call(api.put, `/rest/persons/${id}/`, { pattern });
    yield put(actions.updateInfoSuccess(resp.data));
  } catch (err) {
    yield put(actions.updateInfoFailure(err));
  }
}

function* updateI18n(action) {
  try {
    const { id, i18n } = action.payload;
    const resp         = yield call(api.put, `/rest/persons/${id}/i18n/`, i18n);
    yield put(actions.updateI18nSuccess(resp.data));
  } catch (err) {
    yield put(actions.updateI18nFailure(err));
  }
}

function* changeSecurityLevel(action) {
  try {
    const { id, level } = action.payload;
    const resp          = yield call(api.put, `/rest/persons/${id}/`, { secure: level });
    yield put(actions.changeSecurityLevelSuccess(resp.data));
  } catch (err) {
    yield put(actions.changeSecurityLevelFailure(err));
  }
}

function* watchFetchItem() {
  yield takeEvery(types.FETCH_ITEM, fetchItem);
}

function* watchLastFetchAll() {
  yield takeLatest([types.FETCH_ALL, system.INIT], fetchAll);
}

function* watchCreate() {
  yield takeEvery(types.CREATE, create);
}

function* watchUpdateInfo() {
  yield takeEvery(types.UPDATE_INFO, updateInfo);
}

function* watchUpdateI18n() {
  yield takeEvery(types.UPDATE_I18N, updateI18n);
}

function* watchChangeSecurityLevel() {
  yield takeEvery(types.CHANGE_SECURITY_LEVEL, changeSecurityLevel);
}

export const sagas = [
  watchFetchItem,
  watchLastFetchAll,
  watchCreate,
  watchUpdateI18n,
  watchUpdateInfo,
  watchChangeSecurityLevel,
];
