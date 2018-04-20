import { call, put, select, takeLatest } from 'redux-saga/effects';

import api from '../helpers/apiClient';
import { actions, types } from '../redux/modules/lists';
import { actions as collections } from '../redux/modules/collections';
import { actions as units } from '../redux/modules/content_units';
import { actions as files } from '../redux/modules/files';
import { actions as operations } from '../redux/modules/operations';
import { actions as persons } from '../redux/modules/persons';
import { actions as publishers } from '../redux/modules/publishers';
import { selectors as filterSelectors } from '../redux/modules/filters';
import {
  NS_COLLECTION_UNITS,
  NS_COLLECTIONS,
  NS_UNIT_ASSOCIATION_COLLECTION,
  NS_FILE_UNITS,
  NS_FILES,
  NS_MERGE_UNITS,
  NS_OPERATIONS,
  NS_PERSONS,
  NS_PUBLISHERS,
  NS_UNIT_FILE_UNITS,
  NS_UNITS
} from '../helpers/consts';
import { filtersTransformer } from '../filters';
import { updateQuery } from './helpers/url';

const dataReceivers = {
  [NS_COLLECTIONS]: collections.receiveItems,
  [NS_UNIT_ASSOCIATION_COLLECTION]: collections.receiveItems,
  [NS_UNITS]: units.receiveItems,
  [NS_COLLECTION_UNITS]: units.receiveItems,
  [NS_MERGE_UNITS]: units.receiveItems,
  [NS_FILE_UNITS]: units.receiveItems,
  [NS_FILES]: files.receiveItems,
  [NS_UNIT_FILE_UNITS]: files.receiveItems,
  [NS_OPERATIONS]: operations.receiveItems,
  [NS_PERSONS]: persons.receiveItems,
  [NS_PUBLISHERS]: publishers.receiveItems,
};

function* fetchList(action) {
  const { namespace, pageNo } = action.payload;
  const filters               = yield select(state => filterSelectors.getFilters(state.filters, namespace));
  const params                = filtersTransformer.toApiParams(filters);

  let urlParam;
  switch (namespace) {
  case  NS_UNIT_ASSOCIATION_COLLECTION:
    urlParam = NS_COLLECTIONS;
    break;
  case  NS_FILE_UNITS:
  case  NS_MERGE_UNITS:
  case  NS_COLLECTION_UNITS:
    urlParam = NS_UNITS;
    break;
  case NS_UNIT_FILE_UNITS:
    urlParam = NS_FILES;
    break;
  default:
    urlParam = namespace;
    break;
  }

  try {
    const resp = yield call(api.get, `/${urlParam}/`, { params: { page_no: pageNo, ...params } });
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
