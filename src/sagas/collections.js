import { call, put, takeEvery } from 'redux-saga/effects';
import { push } from '@lagunovsky/redux-react-router';

import { NS_COLLECTIONS } from '../helpers/consts';
import api from '../helpers/apiClient';
import { actions, types } from '../redux/modules/collections';
import { actions as units } from '../redux/modules/content_units';
import { actions as lists } from '../redux/modules/lists';

function* fetchItem(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/collections/${id}/`);
    yield put(actions.fetchItemSuccess(resp.data));
  } catch (err) {
    yield put(actions.fetchItemFailure(err));
  }
}

function* fetchItemUnits(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.get, `/collections/${id}/content_units/`);
    yield put(units.receiveItems(resp.data.map(x => x.content_unit)));
    yield put(actions.fetchItemUnitsSuccess({ id, data: resp.data }));
  } catch (err) {
    yield put(actions.fetchItemUnitsFailure(err));
  }
}

function* updateI18n(action) {
  try {
    const { id, i18n } = action.payload;
    const resp         = yield call(api.put, `/collections/${id}/i18n/`, i18n);
    yield put(actions.updateI18nSuccess(resp.data));
  } catch (err) {
    yield put(actions.updateI18nFailure(err));
  }
}

function* updateProperties(action) {
  try {
    const { id, properties } = action.payload;
    const resp               = yield call(api.put, `/collections/${id}/`, { properties });
    yield put(actions.updatePropertiesSuccess(resp.data));
  } catch (err) {
    yield put(actions.updatePropertiesFailure(err));
  }
}

function* associateUnit(action) {
  const { id, properties } = action.payload;
  try {
    yield call(api.post, `/collections/${id}/content_units/`, properties);
    yield put(actions.associateUnitSuccess({ id, properties }));

    const data = yield properties.reduce((r, x) => {
      r.ids.push(x.content_unit_id);
      r.collections.set(x.content_unit_id, { collection_id: id, name: x.name });
      return r;
    }, { ids: [], collections: new Map() });
    yield  put(units.receiveItemsCollections(data));
  } catch (err) {
    yield put(actions.associateUnitFailure({ ...err, content_units_id: properties.content_unit_id }));
  }
}

function* updateItemUnitProperties(action) {
  const { id, ccuId, properties } = action.payload;
  try {
    yield call(api.put, `/collections/${id}/content_units/${ccuId}`, properties);
    yield put(actions.updateItemUnitPropertiesSuccess({ id, ccuId, properties }));
  } catch (err) {
    yield put(actions.updateItemUnitPropertiesFailure({ ...err, content_units_id: ccuId }));
  }
}

function* orderPositions(action) {
  const { id, ...params } = action.payload;
  try {
    const resp = yield call(api.post, `/collections/${id}/order_positions`, params);
    yield put(units.receiveItems(resp.data.map(x => x.content_unit)));
    yield put(actions.fetchItemUnitsSuccess({ id, data: resp.data }));
  } catch (err) {
    yield put(actions.fetchItemUnitsFailure(err));
  }
}

function* deleteItemUnit(action) {
  const { id, ccuId } = action.payload;
  try {
    yield call(api.delete, `/collections/${id}/content_units/${ccuId}`);
    yield put(actions.deleteItemUnitSuccess({ id, ccuId }));
    yield  put(units.removeItemCollections({ collectionId: id, ccuId }));
  } catch (err) {
    yield put(actions.deleteItemUnitFailure({ ...err, content_units_id: ccuId }));
  }
}

function* changeSecurityLevel(action) {
  try {
    const { id, level } = action.payload;
    const resp          = yield call(api.put, `/collections/${id}/`, { secure: level });
    yield put(actions.changeSecurityLevelSuccess(resp.data));
  } catch (err) {
    yield put(actions.changeSecurityLevelFailure(err));
  }
}

function* changeActive(action) {
  try {
    const id   = action.payload;
    const resp = yield call(api.post, `/collections/${id}/activate`);
    yield put(actions.changeActiveSuccess(resp.data));
  } catch (err) {
    yield put(actions.changeActiveFailure(err));
  }
}

function* create(action) {
  try {
    const resp = yield call(api.post, '/collections/', action.payload);
    yield put(actions.createSuccess(resp.data));
  } catch (err) {
    yield put(actions.createFailure(err));
  }
}

function* deleteC(action) {
  const id = action.payload;
  try {
    yield call(api.delete, `/collections/${id}/`);
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

function* watchUpdateProperties() {
  yield takeEvery(types.UPDATE_PROPERTIES, updateProperties);
}

function* watchAssociateUnit() {
  yield takeEvery(types.ASSOCIATE_UNIT, associateUnit);
}

function* watchUpdateItemUnitProperties() {
  yield takeEvery(types.UPDATE_ITEM_UNIT_PROPERTIES, updateItemUnitProperties);
}

function* watchOrderPositions() {
  yield takeEvery(types.ORDER_POSITIONS, orderPositions);
}

function* watchDeleteItemUnit() {
  yield takeEvery(types.DELETE_ITEM_UNIT, deleteItemUnit);
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
  watchAssociateUnit,
  watchUpdateI18n,
  watchUpdateProperties,
  watchUpdateItemUnitProperties,
  watchOrderPositions,
  watchDeleteItemUnit,
  watchChangeSecurityLevel,
  watchChangeActive,
  watchCreate,
  watchDelete,
];
