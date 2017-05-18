import {call, put, takeEvery, takeLatest} from "redux-saga/effects";
import {actions, types} from "../redux/modules/tags";
import api from "../helpers/apiClient";

function* fetchItem(action) {
    try {
        const id = action.payload;
        const resp = yield call(api.get, `/rest/tags/${id}/`);
        yield put(actions.fetchItemSuccess(resp.data));
    } catch (err) {
        yield put(actions.fetchItemFailure(err));
    }
}

function* fetchAll(action) {
    try {
        // TODO: should load all pages
        const resp = yield call(api.get, '/rest/tags/?page_size=1000');
        yield put(actions.fetchAllSuccess(resp.data.data));
    } catch (err) {
        yield put(actions.fetchAllFailure(err));
    }
}

function* updateInfo(action) {
    try {
        const {id, pattern, description} = action.payload;
        const resp = yield call(api.put, `/rest/tags/${id}/`, {pattern, description});
        yield put(actions.updateInfoSuccess(resp.data));
    } catch (err) {
        yield put(actions.updateInfoFailure(err));
    }
}

function* updateI18n(action) {
    try {
        const {id, i18n} = action.payload;
        const resp = yield call(api.put, `/rest/tags/${id}/i18n/`, i18n);
        yield put(actions.updateI18nSuccess(resp.data));
    } catch (err) {
        yield put(actions.updateI18nFailure(err));
    }
}

function* create(action) {
    try {
        const resp = yield call(api.post, '/rest/tags/', action.payload);
        yield put(actions.createSuccess(resp.data));
    } catch (err) {
        yield put(actions.createFailure(err));
    }
}

function* watchFetchItem() {
    yield takeEvery(types.FETCH_ITEM, fetchItem);
}
function* watchLastFetchAll() {
    yield takeLatest(types.FETCH_ALL, fetchAll);
}
function* watchUpdateInfo() {
    yield takeEvery(types.UPDATE_INFO, updateInfo);
}
function* watchUpdateI18n() {
    yield takeEvery(types.UPDATE_I18N, updateI18n);
}
function* watchCreate() {
    yield takeEvery(types.CREATE, create);
}

export const sagas = [
    watchFetchItem,
    watchLastFetchAll,
    watchUpdateInfo,
    watchUpdateI18n,
    watchCreate,
];
