import {createAction, handleActions} from "redux-actions";

/* Types */

const FETCH_ITEM = 'ContentUnits/FETCH_ITEM';
const FETCH_ITEM_SUCCESS = 'ContentUnits/FETCH_ITEM_SUCCESS';
const FETCH_ITEM_FAILURE = 'ContentUnits/FETCH_ITEM_FAILURE';
const CHANGE_SECURITY_LEVEL = 'ContentUnits/CHANGE_SECURITY_LEVEL';
const CHANGE_SECURITY_LEVEL_SUCCESS = 'ContentUnits/CHANGE_SECURITY_LEVEL_SUCCESS';
const CHANGE_SECURITY_LEVEL_FAILURE = 'ContentUnits/CHANGE_SECURITY_LEVEL_FAILURE';
const FETCH_FILES = 'ContentUnits/FETCH_FILES';
const FETCH_FILES_SUCCESS = 'ContentUnits/FETCH_FILES_SUCCESS';


export const types = {
    FETCH_ITEM,
    FETCH_ITEM_SUCCESS,
    FETCH_ITEM_FAILURE,
    CHANGE_SECURITY_LEVEL,
    CHANGE_SECURITY_LEVEL_SUCCESS,
    CHANGE_SECURITY_LEVEL_FAILURE,
    FETCH_FILES,
};

/* Actions */

const fetchItem = createAction(FETCH_ITEM);
const fetchItemSuccess = createAction(FETCH_ITEM_SUCCESS);
const fetchItemFailure = createAction(FETCH_ITEM_FAILURE);
const changeSecurityLevel = createAction(CHANGE_SECURITY_LEVEL);
const changeSecurityLevelSuccess = createAction(CHANGE_SECURITY_LEVEL_SUCCESS);
const changeSecurityLevelFailure = createAction(CHANGE_SECURITY_LEVEL_FAILURE);
const fetchFiles = createAction(FETCH_FILES);
const fetchFilesSuccess = createAction(FETCH_FILES_SUCCESS);

export const actions = {
    fetchItem,
    fetchItemSuccess,
    fetchItemFailure,
    changeSecurityLevel,
    changeSecurityLevelSuccess,
    changeSecurityLevelFailure,
    fetchFiles,
    fetchFilesSuccess
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

const _collections = new Map([
    ['files', [['data', null], ['wip', false], ['errors', null]]]
]);

const initialState = {
    byID: new Map(),
    wip: new Map(Array.from(_keys.values(), x => [x, false])),
    errors: new Map(Array.from(_keys.values(), x => [x, null])),
    collections: _collections
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

    let byID, collections;
    switch (action.type) {
        case CHANGE_SECURITY_LEVEL_SUCCESS:
        case FETCH_ITEM_SUCCESS:
            byID = _setMap(state.byID, action.payload.id, action.payload);
            break;
        case FETCH_FILES_SUCCESS:
            collections = _setMap(state.collections, 'files', action.payload);
            break;
        default:
            byID = state.byID;
            collections = state.collections;
    }

    return {
        ...state,
        byID,
        wip: _setMap(state.wip, key, false),
        errors: _setMap(state.errors, key, null),
        collections: collections
    }
};

export const reducer = handleActions({
    [FETCH_ITEM]: _onRequest,
    [FETCH_ITEM_SUCCESS]: _onSuccess,
    [FETCH_ITEM_FAILURE]: _onFailure,

    [CHANGE_SECURITY_LEVEL]: _onRequest,
    [CHANGE_SECURITY_LEVEL_SUCCESS]: _onSuccess,
    [CHANGE_SECURITY_LEVEL_FAILURE]: _onFailure,

    [FETCH_FILES]: _onRequest,
    [FETCH_FILES_SUCCESS]: _onSuccess,

}, initialState);

/* Selectors */

const getContentUnits = state => state.byID;
const getContentUnitById = state => id => state.byID.get(id);
const getWIP = state => key => state.wip.get(key);
const getError = state => key => state.errors.get(key);
const getCollectionByKey = state => key => state.collections.get(key);

export const selectors = {
    getContentUnitById,
    getWIP,
    getError,
    getCollectionByKey
};
