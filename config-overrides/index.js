const { compose }           = require('react-app-rewired');
const rewireVendorSplitting = require('react-app-rewire-vendor-splitting');
const rewireSilentRenew     = require('./OidcSilentRenew');

module.exports = compose(rewireSilentRenew, rewireVendorSplitting);
