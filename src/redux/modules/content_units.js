import {createAction, handleActions} from "redux-actions";

/* Types */

const FETCH_ITEM = 'ContentUnits/FETCH_ITEM';
const FETCH_ITEM_SUCCESS = 'ContentUnits/FETCH_ITEM_SUCCESS';
const FETCH_ITEM_FAILURE = 'ContentUnits/FETCH_ITEM_FAILURE';
const CHANGE_SECURITY_LEVEL = 'ContentUnits/CHANGE_SECURITY_LEVEL';
const CHANGE_SECURITY_LEVEL_SUCCESS = 'ContentUnits/CHANGE_SECURITY_LEVEL_SUCCESS';
const CHANGE_SECURITY_LEVEL_FAILURE = 'ContentUnits/CHANGE_SECURITY_LEVEL_FAILURE';
const UPDATE_I18N = 'ContentUnits/UPDATE_I18N';
const UPDATE_I18N_SUCCESS = 'ContentUnits/UPDATE_I18N_SUCCESS';
const UPDATE_I18N_FAILURE = 'ContentUnits/UPDATE_I18N_FAILURE';


export const types = {
    FETCH_ITEM,
    FETCH_ITEM_SUCCESS,
    FETCH_ITEM_FAILURE,
    CHANGE_SECURITY_LEVEL,
    CHANGE_SECURITY_LEVEL_SUCCESS,
    CHANGE_SECURITY_LEVEL_FAILURE,
    UPDATE_I18N,
    UPDATE_I18N_SUCCESS,
    UPDATE_I18N_FAILURE,
};

/* Actions */

const fetchItem = createAction(FETCH_ITEM);
const fetchItemSuccess = createAction(FETCH_ITEM_SUCCESS);
const fetchItemFailure = createAction(FETCH_ITEM_FAILURE);
const changeSecurityLevel = createAction(CHANGE_SECURITY_LEVEL);
const changeSecurityLevelSuccess = createAction(CHANGE_SECURITY_LEVEL_SUCCESS);
const changeSecurityLevelFailure = createAction(CHANGE_SECURITY_LEVEL_FAILURE);
const updateI18n = createAction(UPDATE_I18N, (id, i18n) => ({id, i18n}));
const updateI18nSuccess = createAction(UPDATE_I18N_SUCCESS);
const updateI18nFailure = createAction(UPDATE_I18N_FAILURE);

export const actions = {
    fetchItem,
    fetchItemSuccess,
    fetchItemFailure,
    changeSecurityLevel,
    changeSecurityLevelSuccess,
    changeSecurityLevelFailure,
    updateI18n,
    updateI18nSuccess,
    updateI18nFailure,
};

/* Reducer */

const _keys = new Map([
    [FETCH_ITEM, 'fetchItem'],
    [FETCH_ITEM_SUCCESS, 'fetchItem'],
    [FETCH_ITEM_FAILURE, 'fetchItem'],
    [CHANGE_SECURITY_LEVEL, 'changeSecurityLevel'],
    [CHANGE_SECURITY_LEVEL_SUCCESS, 'changeSecurityLevel'],
    [CHANGE_SECURITY_LEVEL_FAILURE, 'changeSecurityLevel'],
    [UPDATE_I18N, 'updateI18n'],
    [UPDATE_I18N_SUCCESS, 'updateI18n'],
    [UPDATE_I18N_FAILURE, 'updateI18n'],
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
        case UPDATE_I18N_SUCCESS:
            byID = _setMap(state.byID, action.payload.id, action.payload);
            break;
        default:
            byID = state.byID;
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


    [UPDATE_I18N]: _onRequest,
    [UPDATE_I18N_SUCCESS]: _onSuccess,
    [UPDATE_I18N_FAILURE]: _onFailure,

}, initialState);

/* Selectors */

const getContentUnitById = state => id => state.byID.get(id);
const getWIP = state => key => state.wip.get(key);
const getError = state => key => state.errors.get(key);

export const selectors = {
    getContentUnitById,
    getWIP,
    getError,
};
