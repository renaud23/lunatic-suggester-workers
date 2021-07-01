var path = require('path');
var PACKAGE = require('./package.json');
var version = PACKAGE.version;

module.exports = {
  mode: 'production',
  entry: './searching-worker.js',
  output: {
    path: path.resolve('./release'),
    filename: `lunatic-searching-worker-${version}.js`,
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: 'babel-loader',
      },
    ],
  },
};
