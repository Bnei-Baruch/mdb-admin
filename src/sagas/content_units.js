import {call, put, takeEvery} from "redux-saga/effects";
import {actions, types} from "../redux/modules/content_units";
import api from "../helpers/apiClient";

function* fetchItem(action) {
    try {
        const id = action.payload;
        const resp = yield call(api.get, `/rest/content_units/${id}/`);
        yield put(actions.fetchItemSuccess(resp.data));
    } catch (err) {
        yield put(actions.fetchItemFailure(err));
    }
}

function* changeSecurityLevel(action) {
    try {
        const {id, level} = action.payload;
        const resp = yield call(api.put, `/rest/content_units/${id}/`, {secure: level});
        yield put(actions.changeSecurityLevelSuccess(resp.data));
    } catch (err) {
        yield put(actions.changeSecurityLevelFailure(err));
    }
}

function* updateI18n(action) {
    try {
        const {id, i18n} = action.payload;
        const resp = yield call(api.put, `/rest/content_units/${id}/i18n/`, i18n);
        yield put(actions.updateI18nSuccess(resp.data));
    } catch (err) {
        yield put(actions.updateI18nFailure(err));
    }
}

function* watchFetchItem() {
    yield takeEvery(types.FETCH_ITEM, fetchItem);
}
function* watchChangeSecurityLevel() {
    yield takeEvery(types.CHANGE_SECURITY_LEVEL, changeSecurityLevel);
}
function* watchUpdateI18n() {
    yield takeEvery(types.UPDATE_I18N, updateI18n);
}

export const sagas = [
    watchFetchItem,
    watchChangeSecurityLevel,
    watchUpdateI18n,
];
