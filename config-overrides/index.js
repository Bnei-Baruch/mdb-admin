const { override }      = require('customize-cra');
//const rewireVendorSplitting = require('react-app-rewire-vendor-splitting');
const rewireSilentRenew = require('./OidcSilentRenew');

module.exports = override(rewireSilentRenew);
