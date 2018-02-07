import { call, put, takeEvery, select } from 'redux-saga/effects';
import { actions, types } from '../redux/modules/search';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { filtersTransformer } from '../filters';
import api from '../helpers/apiClient';
import { relationshipResponseToPaginated } from '../helpers/apiResponseTransforms';

const namespaceToRequest = {
    'content_units': (params) => api.get('/content_units/', { params }),
    'collections': (params) => api.get('/collections/', { params }),
    'files': (params) => api.get('/files/', { params }),
    'operations': (params) => api.get('/operations/', { params }),
    'operation.files': (params, meta) => {
        return api.get(`/operations/${meta.id}/files/`, { params })
            // patch response for infinite search
            .then(response => relationshipResponseToPaginated(response))
    }
};

function* searchItems(action) {
    const { namespace, startIndex, stopIndex, params: localParams, meta } = action.payload;
    
    try {
        const request = namespaceToRequest[namespace];
        const filters = yield select(state => filterSelectors.getFilters(state.filters, namespace));
        const params  = filtersTransformer.toApiParams(filters);
        const response = yield call(request, {
            'start_index': startIndex,
            'stop_index': stopIndex,
            ...params,
            ...localParams
        }, meta);
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
