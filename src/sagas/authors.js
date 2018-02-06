import { call, put, takeLatest } from 'redux-saga/effects';
import { USER_FOUND } from 'redux-oidc';

import { actions, types } from '../redux/modules/authors';
import api from '../helpers/apiClient';

function* fetchAll(action) {
  try {
    const resp = yield call(api.get, '/rest/authors/');
    yield put(actions.fetchAllSuccess(resp.data));
  } catch (err) {
    yield put(actions.fetchAllFailure(err));
  }
}

function* watchLastFetchAll() {
  yield takeLatest([types.FETCH_ALL, USER_FOUND], fetchAll);
}

export const sagas = [
  watchLastFetchAll,
];
