import { call, put, takeEvery, select } from 'redux-saga/effects';
import { actions, types } from '../redux/modules/search';
import { selectors as filterSelectors } from '../redux/modules/filters';
import api from '../helpers/apiClient';

const namespaceToRequest = {
    'content_units': (params) => api.get('/rest/content_units/', { params })
};

function* searchItems(action) {
    const { namespace, startIndex, stopIndex } = action.payload;
    
    try {
        const request = namespaceToRequest[namespace];
        const filters = yield select(state => filterSelectors.getFilters(state.filters, namespace));

        // FIXME: (yaniv) see that filters are built correctly
        console.log(filters);
        const response = yield call(request, {
            'start_index': startIndex,
            'stop_index': stopIndex,
            ...filters
        });
        yield put(actions.searchItemsSuccess(namespace, response.data, startIndex, stopIndex));
    } catch (error) {
        yield put(actions.searchItemsFailure(namespace, error));
    }
}

function* watchSearchItems() {
  yield takeEvery(types.SEARCH_ITEMS, searchItems);
}

export const sagas = [
  watchSearchItems,
];
