import { put, select, takeEvery } from 'redux-saga/effects';
import { getQuery, updateQuery } from './helpers/url';
import { actions as filterActions, selectors as filterSelectors, types as filterTypes } from '../redux/modules/filters';
import { filtersTransformer } from '../filters';

/*
 * When a filter value is changed, the query is also changed to match..
 * The params in the query can have the filter's name and value transformed (to for example a different string representation)
 * The filters values can be hydrated (by dispatching HYDRATE_FILTERS) from a query containing keys and values matching filters that know how to transform them.
 * The hydration is needed when a we mount a page containing filters and we have a query full of filter values (this enables us to link to specific results).
 * You can know that filter values have been hydrated when the FILTERS_HYDRATED action is dispatched.
 *
 * The sagas will catch actions that change filter values and update the query accordingly.
 * NOTE: if you add new actions you'll need to watch for those too.
 */

function* updateFilterValuesInQuery(action) {
  if (action.payload.isUpdateQuery) {
    const filters = yield select(state => filterSelectors.getFilters(state.filters, action.payload.namespace));
    yield* updateQuery(query => Object.assign(query, filtersTransformer.toQueryParams(filters)));
  }
}

function* hydrateFilters(action) {
  const { namespace, from } = action.payload;
  let filters;

  if (from === 'query') {
    const query = yield* getQuery();
    filters     = filtersTransformer.fromQueryParams(query);
  }

  if (filters) {
    yield put(filterActions.setHydratedFilterValues(namespace, filters));
    yield put(filterActions.filtersHydrated(namespace));
  }
}

const valueChangingActions = [
  filterTypes.ADD_FILTER_VALUE,
  filterTypes.SET_FILTER_VALUE,
  filterTypes.REMOVE_FILTER_VALUE
];

function* watchFilterValueChange() {
  yield takeEvery(valueChangingActions, updateFilterValuesInQuery);
}

function* watchHydrateFilters() {
  yield takeEvery(filterTypes.HYDRATE_FILTERS, hydrateFilters);
}

export const sagas = [
  watchFilterValueChange,
  watchHydrateFilters
];
