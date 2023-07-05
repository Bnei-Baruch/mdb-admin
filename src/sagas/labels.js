import { call, put, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import { actions, types } from '../redux/modules/labels';
import api from '../helpers/apiClient';
import { actions as lists } from '../redux/modules/lists';
import { NS_LABELS } from '../helpers/consts';

function* fetchItem(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/labels/${id}/`);
    yield put(actions.fetchItemSuccess(resp.data));
  } catch (err) {
    yield put(actions.fetchItemFailure(err));
  }
}

function* updateI18n(action) {
  try {
    const { id, i18n } = action.payload;
    const resp         = yield call(api.put, `/labels/${id}/i18n/`, i18n);
    yield put(actions.updateI18nSuccess(resp.data));
  } catch (err) {
    yield put(actions.updateI18nFailure(err));
  }
}

function* deleteLabel(action) {
  const id = action.payload;
  try {
    yield call(api.delete, `/labels/${id}/`);
    yield put(lists.removeItem(NS_LABELS, id));
    yield put(actions.deleteSuccess(id));
    yield put(push('/labels'));
  } catch (err) {
    yield put(actions.deleteFailure(err));
  }
}

function* watchFetchItem() {
  yield takeEvery(types.FETCH_ITEM, fetchItem);
}

function* watchUpdateI18n() {
  yield takeEvery(types.UPDATE_I18N, updateI18n);
}

function* watchDelete() {
  yield takeEvery(types.DELETE, deleteLabel);
}

export const sagas = [
  watchFetchItem,
  watchUpdateI18n,
  watchDelete,
];
