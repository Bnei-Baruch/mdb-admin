/* eslint-disable */

// This module is here for suitcase installations.
// On such environments we want to allow privileged admin access
// to local users of the machine.
// We do this by faking relevant parts of the oidc-client-js library.

class User {
  constructor() {
    this.profile = {
      name: 'archive',
    }
  }

  get fake() {
    return true;
  }

  get expires_in() {
    return undefined;
  }

  get expired() {
    return undefined;
  }

  get scopes() {
    return [];
  }

  toStorageString() {
    return '';
  }

  static fromStorageString() {
    return new User();
  }
}

const fakeUser = new User();

export class UserManager {
  // OidcClient (inherited)

  get settings() {
    throw new Error('Method Not Implemented: OidcClient.settings [getter]');
  }

  get metadataService() {
    throw new Error('Method Not Implemented: OidcClient.metadataService [getter]');
  }

  createSigninRequest() {
    console.log('OidcClient.createSigninRequest');
  }

  processSigninResponse() {
    console.log('OidcClient.processSigninResponse');
  }

  createSignoutRequest() {
    console.log('OidcClient.createSignoutRequest');
  }

  processSignoutResponse() {
    console.log('OidcClient.processSignoutResponse');
  }

  clearStaleState() {
    console.log('OidcClient.clearStaleState');
  }

  // UserManager

  constructor() {
    this._events = new UserManagerEvents();
  }

  get events() {
    console.log('UserManager.events [getter]');
    return this._events;
  }

  getUser() {
    console.log('UserManager.getUser');
    return Promise.resolve(fakeUser).then((user) => {
      this._events.load(user, false);
      return user;
    });
  }

  removeUser() {
    console.log('UserManager.removeUser');
  }

  signinRedirect() {
    console.log('UserManager.signinRedirect');
  }

  signinRedirectCallback() {
    console.log('UserManager.signinRedirectCallback');
  }

  signinPopup() {
    console.log('UserManager.signinPopup');
  }

  signinPopupCallback() {
    console.log('UserManager.signinPopupCallback');
  }

  signinSilent() {
    console.log('UserManager.signinSilent');
    return Promise.resolve(null);
  }

  signinSilentCallback() {
    console.log('UserManager.signinSilentCallback');
  }

  querySessionStatus() {
    console.log('UserManager.querySessionStatus');
  }

  signoutRedirect() {
    console.log('UserManager.signoutRedirect');
  }

  signoutRedirectCallback() {
    console.log('UserManager.signoutRedirectCallback');
  }

  signoutPopup() {
    console.log('UserManager.signoutPopup');
  }

  signoutPopupCallback() {
    console.log('UserManager.signoutPopupCallback');
  }

  revokeAccessToken() {
    console.log('UserManager.revokeAccessToken');
  }

  startSilentRenew() {
    console.log('UserManager.startSilentRenew');
  }

  stopSilentRenew() {
    console.log('UserManager.stopSilentRenew');
  }

  storeUser() {
    console.log('UserManager.storeUser');
  }
}

// Events

// this one is taken almost AS IS from:
// https://github.com/IdentityModel/oidc-client-js/blob/dev/src/Event.js
export class Event {
  constructor(name) {
    this._name      = name;
    this._callbacks = [];
  }

  addHandler(cb) {
    this._callbacks.push(cb);
  }

  removeHandler(cb) {
    var idx = this._callbacks.findIndex(item => item === cb);
    if (idx >= 0) {
      this._callbacks.splice(idx, 1);
    }
  }

  raise(...params) {
    for (let i = 0; i < this._callbacks.length; i++) {
      this._callbacks[i](...params);
    }
  }
}

// this one is taken almost AS IS from:
// https://github.com/IdentityModel/oidc-client-js/blob/dev/src/UserManagerEvents.js
class UserManagerEvents {

  // inherited from AccessTokenEvents

  addAccessTokenExpiring(cb) {
    // noop
  }

  removeAccessTokenExpiring(cb) {
    // noop
  }

  addAccessTokenExpired(cb) {
    // noop
  }

  removeAccessTokenExpired(cb) {
    // noop
  }

  // UserManagerEvents

  constructor() {
    this._userLoaded         = new Event('User loaded');
    this._userUnloaded       = new Event('User unloaded');
    this._silentRenewError   = new Event('Silent renew error');
    this._userSignedOut      = new Event('User signed out');
    this._userSessionChanged = new Event('User session changed');
  }

  load(user, raiseEvent = true) {
    if (raiseEvent) {
      this._userLoaded.raise(user);
    }
  }

  unload() {
    this._userUnloaded.raise();
  }

  addUserLoaded(cb) {
    this._userLoaded.addHandler(cb);
  }

  removeUserLoaded(cb) {
    this._userLoaded.removeHandler(cb);
  }

  addUserUnloaded(cb) {
    this._userUnloaded.addHandler(cb);
  }

  removeUserUnloaded(cb) {
    this._userUnloaded.removeHandler(cb);
  }

  addSilentRenewError(cb) {
    this._silentRenewError.addHandler(cb);
  }

  removeSilentRenewError(cb) {
    this._silentRenewError.removeHandler(cb);
  }

  _raiseSilentRenewError(e) {
    this._silentRenewError.raise(e);
  }

  addUserSignedOut(cb) {
    this._userSignedOut.addHandler(cb);
  }

  removeUserSignedOut(cb) {
    this._userSignedOut.removeHandler(cb);
  }

  _raiseUserSignedOut(e) {
    this._userSignedOut.raise(e);
  }

  addUserSessionChanged(cb) {
    this._userSessionChanged.addHandler(cb);
  }

  removeUserSessionChanged(cb) {
    this._userSessionChanged.removeHandler(cb);
  }

  _raiseUserSessionChanged(e) {
    this._userSessionChanged.raise(e);
  }
}
