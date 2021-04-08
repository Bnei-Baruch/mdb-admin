import { call, put, takeLatest } from 'redux-saga/effects';

import api from '../helpers/apiClient';
import { actions, types } from '../redux/modules/search';
import { NS_COLLECTIONS } from '../helpers/consts';
import { actions as collections } from '../redux/modules/collections';

function* searchCollections(action) {
  const { query } = action.payload;
  try {
    const resp = yield call(api.get, `/${NS_COLLECTIONS}/`, { params: { page_no: 1, query } });

    yield put(collections.receiveItems(resp.data.data));
    yield put(actions.searchCollectionsSuccess(resp.data.data));
  } catch (err) {
    yield put(actions.searchCollectionsFailure(err));
  }
}

function* watchSearchCollections() {
  yield takeLatest(types.SEARCH_COLLECTIONS, searchCollections);
}

export const sagas = [
  watchSearchCollections,
];
