import { call, put, takeEvery } from 'redux-saga/effects';

import { actions, types } from '../redux/modules/operations';
import { actions as files } from '../redux/modules/files';
import api from '../helpers/apiClient';

function* fetchItem(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/rest/operations/${id}/`);
    yield put(actions.fetchItemSuccess(resp.data));
  } catch (err) {
    yield put(actions.fetchItemFailure(err));
  }
}

function* fetchItemFiles(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/rest/operations/${id}/files/`);
    yield put(files.receiveItems(resp.data));
    yield put(actions.fetchItemFilesSuccess({ id, data: resp.data }));
  } catch (err) {
    yield put(actions.fetchItemFilesFailure(err));
  }
}

function* watchFetchItem() {
  yield takeEvery(types.FETCH_ITEM, fetchItem);
}

function* watchFetchItemFiles() {
  yield takeEvery(types.FETCH_ITEM_FILES, fetchItemFiles);
}

export const sagas = [
  watchFetchItem,
  watchFetchItemFiles,
];
