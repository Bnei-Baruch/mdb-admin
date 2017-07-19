import { call, put, takeEvery } from 'redux-saga/effects';
import { actions, types } from '../redux/modules/collections';
import { actions as units } from '../redux/modules/content_units';
import api from '../helpers/apiClient';

function* fetchItem(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/rest/collections/${id}/`);
    yield put(actions.fetchItemSuccess(resp.data));
  } catch (err) {
    yield put(actions.fetchItemFailure(err));
  }
}

function* fetchItemUnits(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/rest/collections/${id}/content_units/`);
    yield put(units.receiveItems(resp.data.map(x => x.content_unit)));
    yield put(actions.fetchItemUnitsSuccess({ id, data: resp.data }));
  } catch (err) {
    yield put(actions.fetchItemUnitsFailure(err));
  }
}


function* create(action) {
    try {
        const resp = yield call(api.post, '/rest/collections/', action.payload);
        yield put(actions.createSuccess(resp.data));
    } catch (err) {
        yield put(actions.createFailure(err));
    }
}

function* changeSecurityLevel(action) {
  try {
    const { id, level } = action.payload;
    const resp          = yield call(api.put, `/rest/collections/${id}/`, { secure: level });
    yield put(actions.changeSecurityLevelSuccess(resp.data));
  } catch (err) {
    yield put(actions.changeSecurityLevelFailure(err));
  }
}

function* updateI18n(action) {
  try {
    const { id, i18n } = action.payload;
    const resp         = yield call(api.put, `/rest/content_units/${id}/i18n/`, i18n);
    yield put(actions.updateI18nSuccess(resp.data));
  } catch (err) {
    yield put(actions.updateI18nFailure(err));
  }
}

function* watchFetchItem() {
  yield takeEvery(types.FETCH_ITEM, fetchItem);
}

function* watchFetchItemUnits() {
  yield takeEvery(types.FETCH_ITEM_UNITS, fetchItemUnits);
}

function* watchChangeSecurityLevel() {
  yield takeEvery(types.CHANGE_SECURITY_LEVEL, changeSecurityLevel);
}

function* watchUpdateI18n() {
  yield takeEvery(types.UPDATE_I18N, updateI18n);
}

function* watchCreate() {
  yield takeEvery(types.CREATE, create);
}

export const sagas = [
  watchFetchItem,
  watchFetchItemUnits,
  watchChangeSecurityLevel,
  watchUpdateI18n,
  watchCreate,
];
