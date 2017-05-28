import {createAction, handleActions} from "redux-actions";

/* Types */

const FETCH_ITEM = 'Files/FETCH_ITEM';
const FETCH_ITEM_SUCCESS = 'Files/FETCH_ITEM_SUCCESS';
const FETCH_ITEM_FAILURE = 'Files/FETCH_ITEM_FAILURE';
const CHANGE_SECURITY_LEVEL = 'Files/CHANGE_SECURITY_LEVEL';
const CHANGE_SECURITY_LEVEL_SUCCESS = 'Files/CHANGE_SECURITY_LEVEL_SUCCESS';
const CHANGE_SECURITY_LEVEL_FAILURE = 'Files/CHANGE_SECURITY_LEVEL_FAILURE';


export const types = {
    FETCH_ITEM,
    FETCH_ITEM_SUCCESS,
    FETCH_ITEM_FAILURE,
    CHANGE_SECURITY_LEVEL,
    CHANGE_SECURITY_LEVEL_SUCCESS,
    CHANGE_SECURITY_LEVEL_FAILURE,
};

/* Actions */

const fetchItem = createAction(FETCH_ITEM);
const fetchItemSuccess = createAction(FETCH_ITEM_SUCCESS);
const fetchItemFailure = createAction(FETCH_ITEM_FAILURE);
const changeSecurityLevel = createAction(CHANGE_SECURITY_LEVEL);
const changeSecurityLevelSuccess = createAction(CHANGE_SECURITY_LEVEL_SUCCESS);
const changeSecurityLevelFailure = createAction(CHANGE_SECURITY_LEVEL_FAILURE);

export const actions = {
    fetchItem,
    fetchItemSuccess,
    fetchItemFailure,
    changeSecurityLevel,
    changeSecurityLevelSuccess,
    changeSecurityLevelFailure,
};

/* Reducer */

const _keys = new Map([
    [FETCH_ITEM, 'fetchItem'],
    [FETCH_ITEM_SUCCESS, 'fetchItem'],
    [FETCH_ITEM_FAILURE, 'fetchItem'],
    [CHANGE_SECURITY_LEVEL, 'changeSecurityLevel'],
    [CHANGE_SECURITY_LEVEL_SUCCESS, 'changeSecurityLevel'],
    [CHANGE_SECURITY_LEVEL_FAILURE, 'changeSecurityLevel'],
]);

const initialState = {
    byID: new Map(),
    wip: new Map(Array.from(_keys.values(), x => [x, false])),
    errors: new Map(Array.from(_keys.values(), x => [x, null])),
};

const _setMap = (m, k, v) => {
    const nm = new Map(m);
    nm.set(k, v);
    return nm
};

const _onRequest = (state, action) => ({
    ...state,
    wip: _setMap(state.wip, _keys.get(action.type), true)
});

const _onFailure = (state, action) => {
    const key = _keys.get(action.type);
    return {
        ...state,
        wip: _setMap(state.wip, key, false),
        errors: _setMap(state.errors, key, action.payload),
    }
};

const _onSuccess = (state, action) => {
    const key = _keys.get(action.type);

    let byID;
    switch (action.type) {
        case CHANGE_SECURITY_LEVEL_SUCCESS:
        case FETCH_ITEM_SUCCESS:
            byID = _setMap(state.byID, action.payload.id, action.payload);
            break;
        default:
            byID = state.byID
    }

    return {
        ...state,
        byID,
        wip: _setMap(state.wip, key, false),
        errors: _setMap(state.errors, key, null),
    }
};

export const reducer = handleActions({
    [FETCH_ITEM]: _onRequest,
    [FETCH_ITEM_SUCCESS]: _onSuccess,
    [FETCH_ITEM_FAILURE]: _onFailure,

    [CHANGE_SECURITY_LEVEL]: _onRequest,
    [CHANGE_SECURITY_LEVEL_SUCCESS]: _onSuccess,
    [CHANGE_SECURITY_LEVEL_FAILURE]: _onFailure,

}, initialState);

/* Selectors */

const getFiles = state => state.byID;
const getFileById = state => id => state.byID.get(id);
const getWIP = state => key => state.wip.get(key);
const getError = state => key => state.errors.get(key);

export const selectors = {
    getFileById,
    getWIP,
    getError,
};
