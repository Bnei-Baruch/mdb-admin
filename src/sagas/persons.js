import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';

import { actions, types } from '../redux/modules/persons';
import api from '../helpers/apiClient';

function* fetchItem(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/rest/persons/${id}/`);
    yield put(actions.fetchItemSuccess(resp.data));
  } catch (err) {
    yield put(actions.fetchItemFailure(err));
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

function* watchFetchItem() {
  yield takeEvery(types.FETCH_ITEM, fetchItem);
}

function* watchCreate() {
  yield takeEvery(types.CREATE, create);
}

export const sagas = [
  watchFetchItem,
  watchCreate,
];
