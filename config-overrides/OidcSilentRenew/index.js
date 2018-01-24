/* eslint-disable no-param-reassign */
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function rewireSilentRenew(config, env) {

  // react-app-rewire-vendor-splitting is not modifying the config in development
  if (env !== 'production') {
    config.entry = {
      main: config.entry,
    };

    // emit to different filename
    config.output.filename = 'static/js/bundle-[name].js';
  }

  config.entry.silentRenew = ['./src/silent_renew.js'];

  // exclude silentRenew chunk from main html plugin
  const mainHtmlPlugin = config.plugins.find(x => x.constructor.name === 'HtmlWebpackPlugin');
  mainHtmlPlugin.options.excludeChunks.push('silentRenew');

  // add new html plugin for silent renew
  config.plugins.push(new HtmlWebpackPlugin({
      template: './public/silent_renew.html',
      excludeChunks: ['main'],
      filename: 'silent_renew.html'
    })
  );

  return config;
};
