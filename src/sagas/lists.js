import { call, put, select, takeLatest } from 'redux-saga/effects';

import api from '../helpers/apiClient';
import { actions, types } from '../redux/modules/lists';
import { actions as collections } from '../redux/modules/collections';
import { actions as units } from '../redux/modules/content_units';
import { actions as files } from '../redux/modules/files';
import { actions as operations } from '../redux/modules/operations';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { NS_COLLECTIONS, NS_FILES, NS_OPERATIONS, NS_UNITS } from '../helpers/consts';
import { filtersTransformer } from '../filters';
import { updateQuery } from './helpers/url';

const dataReceivers = {
  [NS_COLLECTIONS]: collections.receiveItems,
  [NS_UNITS]: units.receiveItems,
  [NS_FILES]: files.receiveItems,
  [NS_OPERATIONS]: operations.receiveItems,
};

function* fetchList(action) {
  const { namespace, pageNo, parent } = action.payload;
  const filters               = yield select(state => filterSelectors.getFilters(state.filters, namespace));
  const params                = filtersTransformer.toApiParams(filters);
  const url = parent ? `/rest/${namespace}/ ${parent}` : `/rest/${namespace}/`;

  try {
    const resp = yield call(api.get, url, { params: { page_no: pageNo, ...params } });
    yield put(dataReceivers[namespace](resp.data.data));
    yield put(actions.fetchListSuccess(namespace, resp.data.total, resp.data.data));
  } catch (err) {
    yield put(actions.fetchListFailure(namespace, err));
  }
}

function* updatePageInQuery(action) {
  const { pageNo } = action.payload;
  const page       = pageNo > 1 ? pageNo : null;
  yield* updateQuery(query => Object.assign(query, { page }));
}

function* watchFetchList() {
  yield takeLatest(types.FETCH_LIST, fetchList);
}

function* watchSetPage() {
  yield takeLatest(types.SET_PAGE, updatePageInQuery);
}

export const sagas = [
  watchFetchList,
  watchSetPage,
];
