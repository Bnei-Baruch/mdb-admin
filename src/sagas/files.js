import { call, put, takeEvery } from 'redux-saga/effects';
import { actions, types } from '../redux/modules/files';
import { actions as storages } from '../redux/modules/storages';
import api from '../helpers/apiClient';

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

function* changeSecurityLevel(action) {
  try {
    const { id, level } = action.payload;
    const resp          = yield call(api.put, `/rest/files/${id}/`, { secure: level });
    yield put(actions.changeSecurityLevelSuccess(resp.data));
  } catch (err) {
    yield put(actions.changeSecurityLevelFailure(err));
  }
}

function* updateProperties(action) {
  const { id, properties } = action.payload;
  try {
    yield call(api.put, `/rest/files/${id}/`, properties);
    yield put(actions.updatePropertiesSuccess({ id, properties }));
  } catch (err) {
    yield put(actions.updatePropertiesFailure({ ...err, content_units_id: properties.content_unit_id }));
  }
}

function* watchFetchItem() {
  yield takeEvery(types.FETCH_ITEM, fetchItem);
}

function* watchfetchItemStorages() {
  yield takeEvery(types.FETCH_ITEM_STORAGES, fetchItemStorages);
}

function* watchChangeSecurityLevel() {
  yield takeEvery(types.CHANGE_SECURITY_LEVEL, changeSecurityLevel);
}

function* watchUpdateProperties() {
  yield takeEvery(types.UPDATE_PROPERTIES, updateProperties);
}

export const sagas = [
  watchFetchItem,
  watchfetchItemStorages,
  watchChangeSecurityLevel,
  watchUpdateProperties,
];
