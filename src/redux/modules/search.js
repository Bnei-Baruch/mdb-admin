import { createAction } from 'redux-actions';

const initialState = {};

const SET_PARAMS = 'SET_PARAMS';

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_PARAMS: {
            const oldSearch = state[action.payload.name] || {};
            return {
                ...state,
                [action.payload.name]: {
                    ...oldSearch,
                    params: {
                        ...oldSearch.params,
                        ...action.payload.params
                    }
                }
            };
        }
        default:
            return state;
    }
};

export const getParams = (state, name) => state[name] && state[name].params;

export const setParams = createAction(SET_PARAMS, (name, params) => ({ name, params }));

