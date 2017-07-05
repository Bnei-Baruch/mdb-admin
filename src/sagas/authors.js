import { call, put, takeLatest } from 'redux-saga/effects';

import { actions, types } from '../redux/modules/authors';
import { types as system } from '../redux/modules/system';
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
  yield takeLatest([types.FETCH_ALL, system.INIT], fetchAll);
}

export const sagas = [
  watchLastFetchAll,
];
