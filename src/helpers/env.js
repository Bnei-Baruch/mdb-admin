export const isProduction = process.env.NODE_ENV === 'production';

// Base url of this application
export const BASE_URL = isProduction ?
  'http://app.mdb.bbdomain.org/admin' :
  `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;

// Authentication service root url (OIDC Identity Provider)
export const AUTH_URL = isProduction ?
  'https://accounts.kbb1.com/auth/realms/main' :
  process.env.REACT_APP_AUTH_URL;

// Base url of our beloved backend API
export const API_BACKEND = isProduction ?
  'http://app.mdb.bbdomain.org/' :
  process.env.REACT_APP_MDB_URL;

