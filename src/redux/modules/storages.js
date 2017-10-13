import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import memoize from 'lodash/memoize';

import { bulkMerge } from '../utils';

/* Types */

const RECEIVE_ITEMS = 'Storages/RECEIVE_ITEMS';

export const types = {
  RECEIVE_ITEMS,
};

/* Actions */

const receiveItems = createAction(RECEIVE_ITEMS);

export const actions = {
  receiveItems,
};

/* Reducer */

const initialState = {
  byID: new Map(),
};

const onReceiveItems = (state, action) => ({
  ...state,
  byID: bulkMerge(state.byID, action.payload)
});

export const reducer = handleActions({
  [RECEIVE_ITEMS]: onReceiveItems,
}, initialState);

/* Selectors */

const getStorages    = state => state.byID;
const getStorageById = (state, id) => state.byID.get(id);

const denormIDs = createSelector(getStorages, byID =>
  memoize(ids => ids.map(id => byID.get(id))));

export const selectors = {
  getStorages,
  getStorageById,
  denormIDs,
};
