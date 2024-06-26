import { call, put, takeLatest } from 'redux-saga/effects';

import { actions, types } from '../redux/modules/authors';
import api from '../helpers/apiClient';

function* fetchAll() {
  try {
    const resp = yield call(api.get, '/authors/');
    yield put(actions.fetchAllSuccess(resp.data));
  } catch (err) {
    yield put(actions.fetchAllFailure(err));
  }
}

function* watchLastFetchAll() {
  yield takeLatest(types.FETCH_ALL, fetchAll);
}

export const sagas = [
  watchLastFetchAll,
];
