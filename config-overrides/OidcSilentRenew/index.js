/* eslint-disable no-param-reassign */
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function rewireSilentRenew(config, env) {
  config.entry = {
    main: config.entry.main || config.entry,
    silentRenew: ['./src/silent_renew.js']
  };

  // emit to different filename in development
  if (config.output.filename === 'static/js/bundle.js') {
    config.output.filename = 'static/js/bundle-[name].js';
  }

  // exclude silentRenew chunk from main html plugin
  const mainHtmlPlugin = config.plugins.find(x => x.options && x.options.filename === 'index.html');
  mainHtmlPlugin.options.excludeChunks.push('silentRenew');

  // add new html plugin for silent renew
  config.plugins.push(
    new HtmlWebpackPlugin({
      template: './public/silent_renew.html',
      chunks: ['silentRenew'],
      filename: 'silent_renew.html'
    }),
  );

  return config;
};
