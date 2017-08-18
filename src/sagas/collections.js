import { call, put, takeEvery } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { NS_COLLECTIONS } from '../helpers/consts';
import api from '../helpers/apiClient';
import { actions, types } from '../redux/modules/collections';
import { actions as units } from '../redux/modules/content_units';
import { actions as lists } from '../redux/modules/lists';

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

function* updateI18n(action) {
  try {
    const { id, i18n } = action.payload;
    const resp         = yield call(api.put, `/rest/collections/${id}/i18n/`, i18n);
    yield put(actions.updateI18nSuccess(resp.data));
  } catch (err) {
    yield put(actions.updateI18nFailure(err));
  }
}

function* updateProperties(action) {
  try {
    const { id, properties } = action.payload;
    const resp               = yield call(api.put, `/rest/collections/${id}/`, { properties });
    yield put(actions.updatePropertiesSuccess(resp.data));
  } catch (err) {
    yield put(actions.updatePropertiesFailure(err));
  }
}

function* updateItemUnitProperties(action) {
  try {
    const { id, cuId, name, order } = action.payload;
    let properties = name || order;
    const resp               = yield call(api.put, `/rest/collections/${id}/content_units/${cuId}`, { properties });
    yield put(actions.updatePropertiesSuccess(resp.data));
  } catch (err) {
    yield put(actions.updatePropertiesFailure(err));
  }
}
function* deleteItemUnit(action) {
  try {
    const { id, cuId, name, order } = action.payload;
    let properties = name || order;
    const resp               = yield call(api.put, `/rest/collections/${id}/content_units/${cuId}`, { properties });
    yield put(actions.updatePropertiesSuccess(resp.data));
  } catch (err) {
    yield put(actions.updatePropertiesFailure(err));
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

function* changeActive(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.post, `/rest/collections/${id}/activate`);
    yield put(actions.changeActiveSuccess(resp.data));
  } catch (err) {
    yield put(actions.changeActiveFailure(err));
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

function* deleteC(action) {
  const id = action.payload;
  try {
    yield call(api.delete, `/rest/collections/${id}/`);
    yield put(lists.removeItem(NS_COLLECTIONS, id));
    yield put(actions.deleteSuccess(id));
    yield put(push('/collections'));
  } catch (err) {
    yield put(actions.deleteFailure(err));
  }
}

function* watchFetchItem() {
  yield takeEvery(types.FETCH_ITEM, fetchItem);
}

function* watchFetchItemUnits() {
  yield takeEvery(types.FETCH_ITEM_UNITS, fetchItemUnits);
}

function* watchUpdateI18n() {
  yield takeEvery(types.UPDATE_I18N, updateI18n);
}

function* watchupdateProperties() {
  yield takeEvery(types.UPDATE_PROPERTIES, updateProperties);
}

function* watchUpdateItemUnitProperties() {
  yield takeEvery(types.UPDATE_ITEM_UNIT_PROPERTIES, updateItemUnitProperties);
}

function* watchChangeSecurityLevel() {
  yield takeEvery(types.CHANGE_SECURITY_LEVEL, changeSecurityLevel);
}

function* watchChangeActive() {
  yield takeEvery(types.CHANGE_ACTIVE, changeActive);
}

function* watchCreate() {
  yield takeEvery(types.CREATE, create);
}

function* watchDelete() {
  yield takeEvery(types.DELETE, deleteC);
}

export const sagas = [
  watchFetchItem,
  watchFetchItemUnits,
  watchUpdateI18n,
  watchupdateProperties,
  watchUpdateItemUnitProperties,
  watchChangeSecurityLevel,
  watchChangeActive,
  watchCreate,
  watchDelete,
];
