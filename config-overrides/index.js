const { override }      = require('customize-cra');
const rewireSilentRenew = require('./OidcSilentRenew');

module.exports = override(rewireSilentRenew);
