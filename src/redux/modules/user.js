import { handleActions, createAction } from 'redux-actions';
import client from '../../helpers/apiClient';

export const SET_USER   = 'auth/SET_USER';
export const CLEAR_USER = 'auth/CLEAR_USER';
export const SET_TOKEN  = 'auth/SET_TOKEN';
export const LOGIN      = 'auth/LOGIN';

export const types = { LOGIN };

const setUser        = createAction(SET_USER);
const clearUser      = createAction(CLEAR_USER);
const setToken       = createAction(SET_TOKEN);
const login          = createAction(LOGIN);
export const actions = { setUser, clearUser, setToken, login };

const initialState = {
  user : null,
  token: null
};

export const reducer = handleActions({
  [SET_USER]  : (state, action) => ({ ...state, user: action.payload }),
  [CLEAR_USER]: () => ({ user: null, token: null }),
  [SET_TOKEN] : (state, action) => {
    client.defaults.headers.common.Authorization = `Bearer ${action.payload}`;
    return { ...state, token: action.payload };
  },
}, initialState);

export const selectors = {
  getUser : state => state.user,
  getToken: state => state.token,
};
