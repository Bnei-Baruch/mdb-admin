import { handleActions } from 'redux-actions';
import { USER_EXPIRED, USER_FOUND, USER_LOADED, USER_SIGNED_OUT } from 'redux-oidc';
import { jws } from 'jsrsasign';

/* Reducer */

const initialState = {
  user: null,
};

const onUser = (state, action) => {
  const user = action.payload;

  // Keycloak special handling
  // We decode the access token for the user's roles
  const { payloadObj: { realm_access, resource_access } } = jws.JWS.parse(user.access_token);
  user.realm_access                                       = realm_access;  // eslint-disable-line camelcase
  user.resource_access                                    = resource_access; // eslint-disable-line camelcase

  return { user };
};

export const reducer = handleActions({
  [USER_LOADED]: onUser,
  [USER_FOUND]: onUser,
  [USER_EXPIRED]: () => initialState,
  [USER_SIGNED_OUT]: () => initialState,
}, initialState);

/* Selectors */

const getUser = state => state.user;

export const selectors = {
  getUser,
};
