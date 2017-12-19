import { Log as oidclog } from 'oidc-client';
import { createUserManager } from 'redux-oidc';

oidclog.logger = console;
oidclog.level  = 4;

const BASE_URL = process.env.NODE_ENV !== 'production' ?
  `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}` :
  'http://app.mdb.bbdomain.org/admin';

const AUTH_URL = process.env.NODE_ENV !== 'production' ?
  process.env.REACT_APP_AUTH_URL :
  'https://accounts.kbb1.com/auth/realms/main';

const userManagerConfig = {
  client_id: 'mdb-admin',
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

