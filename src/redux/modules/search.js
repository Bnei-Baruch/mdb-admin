import { createAction, handleActions } from 'redux-actions';
import isFunction from 'lodash/isFunction';
import isEqual from 'lodash/isEqual';

/* Types */

const SEARCH_ITEMS = 'Search/SEARCH_ITEMS';
const SEARCH_ITEMS_SUCCESS = 'Search/SEARCH_ITEMS_SUCCESS';
const SEARCH_ITEMS_FAILURE = 'Search/SEARCH_ITEMS_FAILURE';

export const types = {
  SEARCH_ITEMS,
  SEARCH_ITEMS_SUCCESS,
  SEARCH_ITEMS_FAILURE,
};

/* Actions */

const searchItems = createAction(SEARCH_ITEMS, (namespace, startIndex, stopIndex, params) => ({ namespace, startIndex, stopIndex, params }));
const searchItemsSuccess = createAction(SEARCH_ITEMS_SUCCESS, (namespace, data, startIndex, stopIndex) => ({ namespace, data, startIndex, stopIndex }));
const searchItemsFailure = createAction(SEARCH_ITEMS_FAILURE, (namespace, error) => ({ namespace, error }));

export const actions = {
  searchItems,
  searchItemsSuccess,
  searchItemsFailure,
};

/* Reducer */

const initialState = {
};

const _searchItems = (state, action) => {
    const { namespace } = action.payload;
    const oldNamespace = state[namespace] || {};

    return {
        ...state,
        [namespace]: {
            ...oldNamespace,
            isSearching: true
        }
    };
};

const _searchItemsSuccess = (state, action) => {
    const { namespace, data, startIndex, stopIndex } = action.payload;

    const oldNamespace = state[namespace] || {};
    const items = oldNamespace.items ? oldNamespace.items.slice() : [];
    const newItems = data.data;

    newItems.forEach((item, index) => items[index + startIndex] = item);
    return {
        ...state,
        [namespace]: {
            ...oldNamespace,
            isSearching: false,
            items,
            total: data.total
        }
    };
};

const _searchItemsFailure = (state, action) => {
    const { namespace, error } = action.payload;
    const oldNamespace = state[namespace] || {};

    return {
        ...state,
        [namespace]: {
            ...oldNamespace,
            isSearching: false,
            error
        }
    };
};

export const reducer = handleActions({
  [SEARCH_ITEMS]: _searchItems,
  [SEARCH_ITEMS_SUCCESS]: _searchItemsSuccess,
  [SEARCH_ITEMS_FAILURE]: _searchItemsFailure,
}, initialState);

/* Selectors */
const getIsSearching = (state, namespace) => !!state[namespace] && state[namespace].isSearching;

const getError = (state, namespace) => state[namespace] && state[namespace].error;

const getResultItems = (state, namespace) => (state[namespace] && state[namespace].items) || [];

const getTotal = (state, namespace) =>  (state[namespace] && state[namespace].total) || 0;

export const selectors = {
  getIsSearching,
  getResultItems,
  getTotal,
  getIsSearching,
  getError
};