export const isProduction = import.meta.env.PROD;

// Base url of this application
export const BASE_URL = import.meta.env.REACT_APP_BASE_URL ||
  `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;

// Base name for history (path of BASE_URL)
export const HISTORY_BASENAME = import.meta.env.REACT_APP_HISTORY_BASENAME || '';

// Authentication service root url
export const AUTH_URL = import.meta.env.REACT_APP_AUTH_URL;

// Authentication service root url
export const KC_CLIENT = import.meta.env.REACT_APP_KC_CLIENT;

// Base url of our beloved backend API
export const API_BACKEND = import.meta.env.REACT_APP_MDB_URL;

// Physical files links service url
export const LINKER_URL = import.meta.env.REACT_APP_LINKER_URL;

// Physical HLS files links service url
export const LINKER_HLS_URL = import.meta.env.REACT_APP_LINKER_HLS_URL;
