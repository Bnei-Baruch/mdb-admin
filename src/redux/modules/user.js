import { handleActions } from 'redux-actions';
import { USER_EXPIRED, USER_FOUND, USER_LOADED, USER_SIGNED_OUT } from 'redux-oidc';
import { jws } from 'jsrsasign';

import api from '../../helpers/apiClient';

/* Reducer */

const initialState = {
  user: null,
};

const onUser = (state, action) => {
  const user = action.payload;

  if (user.fake) {
    return { user };
  }

  // Keycloak special handling
  // We decode the access token for the user's roles
  const { payloadObj: { realm_access, resource_access } } = jws.JWS.parse(user.access_token);
  user.realm_access                                       = realm_access;  // eslint-disable-line camelcase
  user.resource_access                                    = resource_access; // eslint-disable-line camelcase

  // Add 'Authorization' header to api client
  api.defaults.headers.common.Authorization = `${user.token_type} ${user.access_token}`;

  return { user };
};

const onNoUser = () => {
  // Remove Authorization header from api client
  delete api.defaults.headers.common.Authorization;

  return { user: null };
};

export const reducer = handleActions({
  [USER_LOADED]: onUser,
  [USER_FOUND]: onUser,
  [USER_EXPIRED]: onNoUser,
  [USER_SIGNED_OUT]: onNoUser,
}, initialState);

/* Selectors */

const getUser = state => state.user;

export const selectors = {
  getUser,
};
