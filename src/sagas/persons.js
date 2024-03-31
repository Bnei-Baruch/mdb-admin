import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import { actions, types } from '../redux/modules/persons';
import api from '../helpers/apiClient';
import { loadAllPages } from './utils';
import { NS_PERSONS } from '../helpers/consts';
import { actions as lists } from '../redux/modules/lists';
import { SET_USER } from '../redux/modules/user';

function* fetchItem(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/persons/${id}/`);
    yield put(actions.fetchItemSuccess(resp.data));
  } catch (err) {
    yield put(actions.fetchItemFailure(err));
  }
}

function* fetchAll() {
  try {
    const data = yield loadAllPages('/persons/');
    yield put(actions.fetchAllSuccess(data));
  } catch (err) {
    yield put(actions.fetchAllFailure(err));
  }
}

function* create(action) {
  try {
    const resp = yield call(api.post, '/persons/', action.payload);
    yield put(actions.createSuccess(resp.data, action.payload.author));
  } catch (err) {
    yield put(actions.createFailure(err));
  }
}

function* updateInfo(action) {
  try {
    const { id, pattern } = action.payload;
    const resp            = yield call(api.put, `/persons/${id}/`, { pattern });
    yield put(actions.updateInfoSuccess(resp.data));
  } catch (err) {
    yield put(actions.updateInfoFailure(err));
  }
}

function* updateI18n(action) {
  try {
    const { id, i18n } = action.payload;
    const resp         = yield call(api.put, `/persons/${id}/i18n/`, i18n);
    yield put(actions.updateI18nSuccess(resp.data));
  } catch (err) {
    yield put(actions.updateI18nFailure(err));
  }
}

function* deletePerson(action) {
  const id = action.payload;
  try {
    yield call(api.delete, `/persons/${id}/`);
    yield put(lists.removeItem(NS_PERSONS, id));
    yield put(actions.deleteSuccess(id));
    yield put(push('/persons'));
  } catch (err) {
    yield put(actions.deleteFailure(err));
  }
}

function* watchFetchItem() {
  yield takeEvery(types.FETCH_ITEM, fetchItem);
}

function* watchLastFetchAll() {
  yield takeLatest([types.FETCH_ALL, SET_USER], fetchAll);
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

function* watchDelete() {
  yield takeEvery(types.DELETE, deletePerson);
}

export const sagas = [
  watchFetchItem,
  watchLastFetchAll,
  watchCreate,
  watchUpdateI18n,
  watchUpdateInfo,
  watchDelete,
];
