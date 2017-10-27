import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import memoize from 'lodash/memoize';

import { setMap } from '../utils';
import { types as sources } from './sources';

/* Types */

const FETCH_ALL         = 'Persons/FETCH_ALL';
const FETCH_ALL_SUCCESS = 'Persons/FETCH_ALL_SUCCESS';
const FETCH_ALL_FAILURE = 'Persons/FETCH_ALL_FAILURE';

export const types = {
  FETCH_ALL,
  FETCH_ALL_SUCCESS,
  FETCH_ALL_FAILURE,
};

/* Actions */

const fetchAll        = createAction(FETCH_ALL);
const fetchAllSuccess = createAction(FETCH_ALL_SUCCESS);
const fetchAllFailure = createAction(FETCH_ALL_FAILURE);

export const actions = {
  fetchAll,
  fetchAllSuccess,
  fetchAllFailure,
};

/* Reducer */

const keys = new Map([
  [FETCH_ALL, 'fetchPersons'],
  [FETCH_ALL_SUCCESS, 'fetchPersons'],
  [FETCH_ALL_FAILURE, 'fetchPersons'],
]);

const initialState = {
  byID: new Map(),
  wip: new Map(Array.from(keys.values(), x => [x, false])),
  errors: new Map(Array.from(keys.values(), x => [x, null])),
};

const onRequest = (state, action) => ({
  ...state,
  wip: setMap(state.wip, keys.get(action.type), true)
});

const onFailure = (state, action) => {
  const key = keys.get(action.type);
  return {
    ...state,
    wip: setMap(state.wip, key, false),
    errors: setMap(state.errors, key, action.payload),
  };
};

const onSuccess = (state, action) => {
  const key = keys.get(action.type);

  let byID;
  switch (action.type) {
  case FETCH_ALL_SUCCESS:
    byID = new Map(action.payload.data.map(x =>
      [
        x.id,
        {
          ...x,
          sources: x.sources.map(y => y.id)
        }
      ]));
    break;
  default:
    byID = state.byID;
  }

  return {
    ...state,
    byID,
    wip: setMap(state.wip, key, false),
    errors: setMap(state.errors, key, null),
  };
};

const onNewSource = (state, action) => {
  const { source, person } = action.payload;
  if (!person) {
    return state;
  }

  const a = { ...state.byID.get(person) };
  a.sources.push(source.id);

  return {
    ...state,
    byID: setMap(state.byID, person, a)
  };
};

export const reducer = handleActions({
  [FETCH_ALL]: onRequest,
  [FETCH_ALL_SUCCESS]: onSuccess,
  [FETCH_ALL_FAILURE]: onFailure,

  [sources.CREATE_SUCCESS]: onNewSource,
}, initialState);

/* Selectors */

const getPersons              = state => state.byID;
const getPersonById           = state => id => state.byID.get(id);
const getWIP                  = state => key => state.wip.get(key);
const getError                = state => key => state.errors.get(key);
const getPersonsList          = createSelector(getPersons, persons => Array.from(persons.values()));
const getPersonByCollectionId = createSelector(getPersonsList, getPersonById,
  (persons, byId) => {
    const pairs = persons.reduce((acc, val) => acc.concat(val.sources.map(x => [x, val.id])), []);
    const m     = new Map(pairs);
    return memoize(id => byId(m.get(id)));
  });

export const selectors = {
  getWIP,
  getError,
  getPersonsList,
  getPersonByCollectionId,
};
