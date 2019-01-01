import { createAction, handleActions } from 'redux-actions';

import { update } from '../utils';

/* Types */

const SET_PAGE           = 'Lists/SET_PAGE';
const FETCH_LIST         = 'Lists/FETCH_LIST';
const FETCH_LIST_SUCCESS = 'Lists/FETCH_LIST_SUCCESS';
const FETCH_LIST_FAILURE = 'Lists/FETCH_LIST_FAILURE';
const REMOVE_ITEM        = 'Lists/REMOVE_ITEM';
const REMOVE_ITEMS       = 'Lists/REMOVE_ITEMS';

export const types = {
  SET_PAGE,
  FETCH_LIST,
  FETCH_LIST_SUCCESS,
  FETCH_LIST_FAILURE,
  REMOVE_ITEM,
  REMOVE_ITEMS,
};

/* Actions */

const setPage          = createAction(SET_PAGE, (namespace, pageNo, isUpdateQuery) => ({
  namespace,
  pageNo,
  isUpdateQuery
}));
const fetchList        = createAction(FETCH_LIST, (namespace, pageNo, parent) => ({ namespace, pageNo, parent }));
const fetchListSuccess = createAction(FETCH_LIST_SUCCESS, (namespace, total, data) => ({ namespace, total, data }));
const fetchListFailure = createAction(FETCH_LIST_FAILURE, (namespace, err) => ({ namespace, err }));
const removeItem       = createAction(REMOVE_ITEM, (namespace, id) => ({ namespace, id }));
const removeItems      = createAction(REMOVE_ITEM, (namespace, ids) => ({ namespace, ids }));

export const actions = {
  setPage,
  fetchList,
  fetchListSuccess,
  fetchListFailure,
  removeItem,
  removeItems,
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

const onRemoveItem  = (state, action) => {
  const { namespace, id } = action.payload;

  const status = state.byNS.get(namespace);
  if (!status) {
    return state;
  }

  const { items } = status;
  const idx       = items.indexOf(id);
  if (idx === -1) {
    return state;
  }

  return {
    ...state,
    byNS: update(state.byNS, namespace,
      x => ({
        ...x,
        items: items.slice(0, idx).concat(items.slice(idx + 1)),
      })),
  };
};
const onRemoveItems = (state, action) => {
  const { namespace, ids } = action.payload;

  const status = state.byNS.get(namespace);
  if (!status) {
    return state;
  }

  const items = status.items.filter(x => ids.includes(x));
  if (items.length === 0) {
    return state;
  }

  return {
    ...state,
    byNS: update(state.byNS, namespace,
      x => ({
        ...x,
        items,
      })),
  };
};

export const reducer = handleActions({
  [SET_PAGE]: onSetPage,
  [FETCH_LIST]: onRequest,
  [FETCH_LIST_FAILURE]: onFailure,
  [FETCH_LIST_SUCCESS]: onSuccess,
  [REMOVE_ITEM]: onRemoveItem,
  [REMOVE_ITEMS]: onRemoveItems,
}, initialState);

/* Selectors */

const getNamespaceState = (state, namespace) => state.byNS.get(namespace);

export const selectors = {
  getNamespaceState,
};
