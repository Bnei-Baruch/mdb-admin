const { compose }       = require('react-app-rewired');
const rewireSilentRenew = require('./OidcSilentRenew');

module.exports = compose(
  rewireSilentRenew,
);
