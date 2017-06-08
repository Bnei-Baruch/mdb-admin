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
function* fetchFiles(action) {
    try {
        const id = action.payload;
        const resp = yield call(api.get, `/rest/content_units/${id}/files`);
        yield put(actions.fetchFilesSuccess(resp.data));
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

function* watchFetchItem() {
    yield takeEvery(types.FETCH_ITEM, fetchItem);
    yield takeEvery(types.FETCH_FILES, fetchFiles);
}
function* watchChangeSecurityLevel() {
    yield takeEvery(types.CHANGE_SECURITY_LEVEL, changeSecurityLevel);
}

export const sagas = [
    watchFetchItem,
    watchChangeSecurityLevel,
];
