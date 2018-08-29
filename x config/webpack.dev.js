/* eslint-disable */
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const defineEnvPlugin = require('./webpack.env');
const webpack = require('webpack');
const path = require('path');

let root = process.cwd();

let weCantMake = function weCantMake (request) {
  return /^dojo/.test(request) || /^dojox/.test(request) || /^dijit/.test(request) || /^esri/.test(request);
};

module.exports = {
  devtool: 'source-map',
  cache: true,
  entry: [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    path.join(root, 'src/js/main')
  ],
  output: {
    path: path.join(root, 'public'),
    filename: 'js/[name].[hash].js',
    libraryTarget: 'amd'
  },
  externals: [function (context, request, callback) {
    if (weCantMake(request)) {
      callback(null, 'amd ' + request);
    } else {
      callback();
    }
  }],
  resolve: {
    alias: {
      'js': path.join(root, 'src/js'),
      'css': path.join(root, 'src/css'),
      'images': path.join(root, 'src/images')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'index.html',
      inject: false
    }),
    new webpack.DefinePlugin(defineEnvPlugin()),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  module: {
    rules: [
    {
      test: /\.scss$/,
      loaders: ['style-loader', 'css-loader', 'sass-loader']
    }, {
      test: /\.js?$/,
      loader: 'babel-loader'
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loaders: [
        'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
        {
          loader: 'image-webpack-loader',
          query: {
            bypassOnDebug: true,
            gifsicle: { interlaced: false },
            optipng: { optimizationLevel: 7 }
          }
        }
      ]
    }]
  }
};
