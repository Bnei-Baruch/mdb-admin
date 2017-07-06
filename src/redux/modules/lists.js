import { createAction, handleActions } from 'redux-actions';

import { update } from '../utils';

/* Types */

const SET_PAGE           = 'Lists/SET_PAGE';
const FETCH_LIST         = 'Lists/FETCH_LIST';
const FETCH_LIST_SUCCESS = 'Lists/FETCH_LIST_SUCCESS';
const FETCH_LIST_FAILURE = 'Lists/FETCH_LIST_FAILURE';

export const types = {
  SET_PAGE,
  FETCH_LIST,
  FETCH_LIST_SUCCESS,
  FETCH_LIST_FAILURE,
};

/* Actions */

const setPage          = createAction(SET_PAGE, (namespace, pageNo) => ({ namespace, pageNo }));
const fetchList        = createAction(FETCH_LIST, (namespace, pageNo) => ({ namespace, pageNo }));
const fetchListSuccess = createAction(FETCH_LIST_SUCCESS, (namespace, total, data) => ({ namespace, total, data }));
const fetchListFailure = createAction(FETCH_LIST_FAILURE, (namespace, err) => ({ namespace, err }));

export const actions = {
  setPage,
  fetchList,
  fetchListSuccess,
  fetchListFailure,
};

/* Reducer */

const initialState = {
  byNS: new Map()
};

const onSetPage = (state, action) => ({
  ...state,
  byNS: update(state.byNS, action.payload.namespace,
    x => ({ ...x, pageNo: action.payload.pageNo })),
});

const onRequest = (state, action) => ({
  ...state,
  byNS: update(state.byNS, action.payload.namespace,
    x => ({ ...x, wip: true })),
});

const onFailure = (state, action) => ({
  ...state,
  byNS: update(state.byNS, action.payload.namespace,
    x => ({ ...x, wip: false, err: action.payload.err })),
});

const onSuccess = (state, action) => ({
  ...state,
  byNS: update(state.byNS, action.payload.namespace,
    x => ({
      ...x,
      wip: false,
      err: null,
      total: action.payload.total,
      items: action.payload.data.map(y => y.id),
    })),
});

export const reducer = handleActions({
  [SET_PAGE]: onSetPage,
  [FETCH_LIST]: onRequest,
  [FETCH_LIST_FAILURE]: onFailure,
  [FETCH_LIST_SUCCESS]: onSuccess,
}, initialState);

/* Selectors */

const getNamespaceState = (state, namespace) => state.byNS.get(namespace);

export const selectors = {
  getNamespaceState,
};
