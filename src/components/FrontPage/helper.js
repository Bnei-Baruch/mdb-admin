import Keycloak from 'keycloak-js';
import { KC_CLIENT, AUTH_URL } from '../../helpers/env';
import { actions } from '../../redux/modules/user';
import { batch } from 'react-redux';

export const kcLogin = () => {
  const url = new URL(window.location.href);
  return keycloak.login({ redirectUri: url.href });
};

const userManagerConfig = {
  url          : AUTH_URL,
  realm        : 'main',
  clientId     : KC_CLIENT,
  scope        : 'profile',
  enableLogging: true
};
let keycloak            = null;

export const getKeycloak = () => {
  if (!keycloak) {
    keycloak = new Keycloak(userManagerConfig);
  }
  return keycloak;
};

let kcWasInited = false;

const options = {
  checkLoginIframe: false,
  flow            : 'standard',
  pkceMethod      : 'S256',
  enableLogging   : true,
  onLoad          : 'check-sso'
};

export const onceInitKC = (dispatch) => {
  if (kcWasInited) return;

  kcWasInited = true;
  getKeycloak().init(options).then(ok => {
    if (!ok) {
      dispatch(actions.clearUser());
      return;
    }

    const { sub, name, realm_access } = getKeycloak().tokenParsed;
    batch(() => {
      dispatch(actions.setUser({ id: sub, name, realm_access }));
      dispatch(actions.setToken(getKeycloak().token));
    });
  }).catch(error => {
    console.error(error);
    dispatch(actions.clearUser());
  });
};
