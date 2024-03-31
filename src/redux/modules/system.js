import { createAction, handleActions } from 'redux-actions';
import { LANG_ENGLISH } from '../../helpers/consts';

/* Types */

const BOOT                    = 'System/BOOT';
const INIT                    = 'System/INIT';
const READY                   = 'System/READY';
const UPDATE_CURRENT_LANGUAGE = 'System/UPDATE_CURRENT_LANGUAGE';

export const types = {
  BOOT,
  INIT,
  READY,
  UPDATE_CURRENT_LANGUAGE
};

/* Actions */

const boot                  = createAction(BOOT);
const init                  = createAction(INIT);
const ready                 = createAction(READY);
const updateCurrentLanguage = createAction(UPDATE_CURRENT_LANGUAGE);

export const actions = {
  boot,
  init,
  ready,
  updateCurrentLanguage
};

/* Reducer */

const initialState = {
  isReady        : false,
  currentLanguage: localStorage.getItem('currentLanguage') || LANG_ENGLISH
};

export const reducer = handleActions({
  [READY]                  : state => ({
    ...state,
    isReady: true
  }),
  [UPDATE_CURRENT_LANGUAGE]: (state, action) => {
    localStorage.setItem('currentLanguage', action.payload);
    return ({
      ...state,
      currentLanguage: action.payload
    });
  }
}, initialState);

/* Selectors */

const isReady            = state => state.isReady;
const getCurrentLanguage = state => state.currentLanguage;

export const selectors = {
  isReady,
  getCurrentLanguage
};
