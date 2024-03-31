import Keycloak from 'keycloak-js';

const KC_API_URL   = 'https://accounts.kab.info/auth';
const KC_CLIENT_ID = 'kmedia-public';
const KC_REALM     = 'main';

export const kcLogin = () => {
  const url = new URL(window.location.href);
  return keycloak.login({ redirectUri: url.href });
};

const userManagerConfig = {
  url          : KC_API_URL,
  realm        : KC_REALM,
  clientId     : KC_CLIENT_ID,
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
