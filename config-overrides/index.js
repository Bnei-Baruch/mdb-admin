const { override }           = require('customize-cra');
//const rewireVendorSplitting = require('react-app-rewire-vendor-splitting');
module.exports = override(rewireSilentRenew);
const rewireSilentRenew     = require('./OidcSilentRenew');
