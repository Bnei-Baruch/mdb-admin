import { call, put, takeEvery } from 'redux-saga/effects';

import api from '../helpers/apiClient';
import { actions, types } from '../redux/modules/files';
import { actions as storages } from '../redux/modules/storages';
import { actions as operations } from '../redux/modules/operations';

function* fetchItem(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/rest/files/${id}/`);
    yield put(actions.fetchItemSuccess(resp.data));
  } catch (err) {
    yield put(actions.fetchItemFailure(err));
  }
}

function* fetchItemStorages(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/rest/files/${id}/storages/`);
    yield put(storages.receiveItems(resp.data));
    yield put(actions.fetchItemStoragesSuccess({ id, data: resp.data }));
  } catch (err) {
    yield put(actions.fetchItemStoragesFailure(err));
  }
}

function* fetchTreeWithOperations(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/rest/files/${id}/tree/`);
    yield put(operations.receiveItems(Object.keys(resp.data.operations).map(key => resp.data.operations[key])));
    yield put(actions.fetchTreeWithOperationsSuccess({ id, files: resp.data.files }));
  } catch (err) {
    yield put(actions.fetchTreeWithOperationsFailure(err));
  }
}

function* changeSecurityLevel(action) {
  try {
    const { id, level } = action.payload;
    const resp          = yield call(api.put, `/rest/files/${id}/`, { secure: level });
    yield put(actions.changeSecurityLevelSuccess(resp.data));
  } catch (err) {
    yield put(actions.changeSecurityLevelFailure(err));
  }
}

function* watchFetchItem() {
  yield takeEvery(types.FETCH_ITEM, fetchItem);
}

function* watchfetchItemStorages() {
  yield takeEvery(types.FETCH_ITEM_STORAGES, fetchItemStorages);
}

function* watchfetchTreeWithOperations() {
  yield takeEvery(types.FETCH_TREE_WITH_OPERATIONS, fetchTreeWithOperations);
}

function* watchChangeSecurityLevel() {
  yield takeEvery(types.CHANGE_SECURITY_LEVEL, changeSecurityLevel);
}

export const sagas = [
  watchFetchItem,
  watchfetchItemStorages,
  watchfetchTreeWithOperations,
  watchChangeSecurityLevel,
];
