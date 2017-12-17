import { Log as oidclog } from 'oidc-client';
import { createUserManager } from 'redux-oidc';

oidclog.logger = console;
oidclog.level = 4;

const userManagerConfig = {
  client_id: 'mdb-admin',
  redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/callback`,
  response_type: 'token id_token',
  scope: 'openid profile',
  authority: 'http://localhost:8090/auth/realms/demo',
  // silent_redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/silent_renew.html`,
  // automaticSilentRenew: true,
  // filterProtocolClaims: true,
  loadUserInfo: true,
};

const userManager = createUserManager(userManagerConfig);

export default userManager;
