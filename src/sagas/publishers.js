import { call, put, takeEvery } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { actions, types } from '../redux/modules/publishers';
import api from '../helpers/apiClient';
import { NS_PUBLISHERS } from '../helpers/consts';
import { actions as lists } from '../redux/modules/lists';

function* fetchItem(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/rest/publishers/${id}/`);
    yield put(actions.fetchItemSuccess(resp.data));
  } catch (err) {
    yield put(actions.fetchItemFailure(err));
  }
}

function* create(action) {
  try {
    const resp = yield call(api.post, '/rest/publishers/', action.payload);
    yield put(actions.createSuccess(resp.data, action.payload.author));
  } catch (err) {
    yield put(actions.createFailure(err));
  }
}

function* updateInfo(action) {
  try {
    const { id, pattern } = action.payload;
    const resp            = yield call(api.put, `/rest/publishers/${id}/`, { pattern });
    yield put(actions.updateInfoSuccess(resp.data));
  } catch (err) {
    yield put(actions.updateInfoFailure(err));
  }
}

function* updateI18n(action) {
  try {
    const { id, i18n } = action.payload;
    const resp         = yield call(api.put, `/rest/publishers/${id}/i18n/`, i18n);
    yield put(actions.updateI18nSuccess(resp.data));
  } catch (err) {
    yield put(actions.updateI18nFailure(err));
  }
}

function* deletePublisher(action) {
  const id = action.payload;
  try {
    yield call(api.delete, `/rest/publishers/${id}/`);
    yield put(lists.removeItem(NS_PUBLISHERS, id));
    yield put(actions.deleteSuccess(id));
    yield put(push('/publishers'));
  } catch (err) {
    yield put(actions.deleteFailure(err));
  }
}

function* watchFetchItem() {
  yield takeEvery(types.FETCH_ITEM, fetchItem);
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
  yield takeEvery(types.DELETE, deletePublisher);
}

export const sagas = [
  watchFetchItem,
  watchCreate,
  watchUpdateI18n,
  watchUpdateInfo,
  watchDelete,
];
