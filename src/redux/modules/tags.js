import {createAction, handleActions} from "redux-actions";
import {buildHierarchy, extractI18n} from "../../helpers/utils";

/* Types */

const FETCH_ITEM = 'TAGS/FETCH_ITEM';
const FETCH_ITEM_SUCCESS = 'TAGS/FETCH_ITEM_SUCCESS';
const FETCH_ITEM_FAILURE = 'TAGS/FETCH_ITEM_FAILURE';
const FETCH_ALL = 'TAGS/FETCH_ALL';
const FETCH_ALL_SUCCESS = 'TAGS/FETCH_ALL_SUCCESS';
const FETCH_ALL_FAILURE = 'TAGS/FETCH_ALL_FAILURE';
const UPDATE_INFO = 'TAGS/UPDATE_INFO';
const UPDATE_INFO_SUCCESS = 'TAGS/UPDATE_INFO_SUCCESS';
const UPDATE_INFO_FAILURE = 'TAGS/UPDATE_INFO_FAILURE';
const UPDATE_I18N = 'TAGS/UPDATE_I18N';
const UPDATE_I18N_SUCCESS = 'TAGS/UPDATE_I18N_SUCCESS';
const UPDATE_I18N_FAILURE = 'TAGS/UPDATE_I18N_FAILURE';
const CREATE = 'TAGS/CREATE';
const CREATE_SUCCESS = 'TAGS/CREATE_SUCCESS';
const CREATE_FAILURE = 'TAGS/CREATE_FAILURE';

export const types = {
    FETCH_ITEM,
    FETCH_ITEM_SUCCESS,
    FETCH_ITEM_FAILURE,
    FETCH_ALL,
    FETCH_ALL_SUCCESS,
    FETCH_ALL_FAILURE,
    UPDATE_INFO,
    UPDATE_INFO_SUCCESS,
    UPDATE_INFO_FAILURE,
    UPDATE_I18N,
    UPDATE_I18N_SUCCESS,
    UPDATE_I18N_FAILURE,
    CREATE,
    CREATE_SUCCESS,
    CREATE_FAILURE,
};

/* Actions */

const fetchItem = createAction(FETCH_ITEM);
const fetchItemSuccess = createAction(FETCH_ITEM_SUCCESS);
const fetchItemFailure = createAction(FETCH_ITEM_FAILURE);
const fetchAll = createAction(FETCH_ALL);
const fetchAllSuccess = createAction(FETCH_ALL_SUCCESS);
const fetchAllFailure = createAction(FETCH_ALL_FAILURE);
const updateInfo = createAction(UPDATE_INFO,
    (id, pattern, description) => ({id, pattern, description}));
const updateInfoSuccess = createAction(UPDATE_INFO_SUCCESS);
const updateInfoFailure = createAction(UPDATE_INFO_FAILURE);
const updateI18n = createAction(UPDATE_I18N,
    (id, i18n) => ({id, i18n}));
const updateI18nSuccess = createAction(UPDATE_I18N_SUCCESS);
const updateI18nFailure = createAction(UPDATE_I18N_FAILURE);
const create = createAction(CREATE,
    (parent_id, pattern, description, i18n) => ({parent_id, pattern, description, i18n}));
const createSuccess = createAction(CREATE_SUCCESS);
const createFailure = createAction(CREATE_FAILURE);

export const actions = {
    fetchItem,
    fetchItemSuccess,
    fetchItemFailure,
    fetchAll,
    fetchAllSuccess,
    fetchAllFailure,
    updateInfo,
    updateInfoSuccess,
    updateInfoFailure,
    updateI18n,
    updateI18nSuccess,
    updateI18nFailure,
    create,
    createSuccess,
    createFailure,
};

/* Reducer */

const _keys = new Map([
    [FETCH_ITEM, 'fetchItem'],
    [FETCH_ITEM_SUCCESS, 'fetchItem'],
    [FETCH_ITEM_FAILURE, 'fetchItem'],
    [FETCH_ALL, 'fetchAll'],
    [FETCH_ALL_SUCCESS, 'fetchAll'],
    [FETCH_ALL_FAILURE, 'fetchAll'],
    [UPDATE_INFO, 'updateInfo'],
    [UPDATE_INFO_SUCCESS, 'updateInfo'],
    [UPDATE_INFO_FAILURE, 'updateInfo'],
    [UPDATE_I18N, 'updateI18n'],
    [UPDATE_I18N_SUCCESS, 'updateI18n'],
    [UPDATE_I18N_FAILURE, 'updateI18n'],
    [CREATE, 'create'],
    [CREATE_SUCCESS, 'create'],
    [CREATE_FAILURE, 'create'],
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
        case FETCH_ITEM_SUCCESS:
        case UPDATE_INFO_SUCCESS:
        case UPDATE_I18N_SUCCESS:
        case CREATE_SUCCESS:
            byID = _setMap(state.byID, action.payload.id, action.payload);
            break;
        case FETCH_ALL_SUCCESS:
            byID = new Map(action.payload.map(x => [x.id, x]));
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

    [FETCH_ALL]: _onRequest,
    [FETCH_ALL_SUCCESS]: _onSuccess,
    [FETCH_ALL_FAILURE]: _onFailure,

    [UPDATE_INFO]: _onRequest,
    [UPDATE_INFO_SUCCESS]: _onSuccess,
    [UPDATE_INFO_FAILURE]: _onFailure,

    [UPDATE_I18N]: _onRequest,
    [UPDATE_I18N_SUCCESS]: _onSuccess,
    [UPDATE_I18N_FAILURE]: _onFailure,

    [CREATE]: _onRequest,
    [CREATE_SUCCESS]: _onSuccess,
    [CREATE_FAILURE]: _onFailure,

}, initialState);

/* Selectors */

const sortHierarchy = (h, getById) => {
    h.childMap.forEach((v, k) => {
        v.sort((a, b) => {
            const aLabel = extractI18n(getById(a).i18n, ['label'])[0],
                bLabel = extractI18n(getById(b).i18n, ['label'])[0];
            if (aLabel < bLabel) {
                return -1;
            }
            if (aLabel > bLabel) {
                return 1;
            }
            return 0;
        });
    });

    return h
};

const getTagById = state => id => state.byID.get(id);
const getHierarchy = state => sortHierarchy(buildHierarchy(state.byID), getTagById(state));
const getWIP = state => key => state.wip.get(key);
const getError = state => key => state.errors.get(key);

export const selectors = {
    getTagById,
    getHierarchy,
    getWIP,
    getError,
};
