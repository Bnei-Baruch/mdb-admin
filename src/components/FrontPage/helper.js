import Keycloak from 'keycloak-js';
import { KC_CLIENT, AUTH_URL } from '../../helpers/env';

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
