import { createUserManager } from 'redux-oidc';

import { AUTH_URL, BASE_URL } from './env';

const userManagerConfig = {
  client_id: 'mdb-admin-ui',
  redirect_uri: `${BASE_URL}/callback`,
  response_type: 'token id_token',
  scope: 'openid profile',
  authority: AUTH_URL,
  post_logout_redirect_uri: `${BASE_URL}/`,
  // silent_redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/silent_renew.html`,
  // automaticSilentRenew: true,
  // filterProtocolClaims: false,
  // loadUserInfo: true,
};

const userManager = createUserManager(userManagerConfig);

export default userManager;

