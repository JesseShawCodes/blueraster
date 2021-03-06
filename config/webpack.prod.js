const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineStylePlugin = require('./inline-style');
const defineEnvPlugin = require('./webpack.env');
const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const root = process.cwd();

const weCantMake = function weCantMake (request) {
  return /^dojo/.test(request) || /^dojox/.test(request) || /^dijit/.test(request) || /^esri/.test(request);
};

module.exports = {
  profile: true,
  entry: path.join(root, 'src/js/main'),
  output: {
    path: path.join(root, 'dist'),
    filename: 'js/[name].[hash].js',
    libraryTarget: 'amd'
  },
  resolve: {
    alias: {
      'js': path.join(root, 'src/js'),
      'css': path.join(root, 'src/css'),
      'images': path.join(root, 'src/images')
    }
  },
  externals: [function (context, request, callback) {
    if (weCantMake(request)) {
      callback(null, 'amd ' + request);
    } else {
      callback();
    }
  }],
  module: {
    rules: [{
      test: /\.js?$/,
      loader: 'babel-loader'
    }, {
      test: /critical\.scss$/,
      use: ExtractTextPlugin.extract(['css-loader', 'postcss-loader', 'sass-loader'])
    }, {
      test: /app\.scss$/,
      loaders: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
    }, {
      test: /\.(jpg|png|svg)$/,
      loader: 'url-loader?limit=25000',
      include: path.images
    }]
  },
  plugins: [
    new webpack.DefinePlugin(defineEnvPlugin()),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      uglifyOptions: {
        compress: false,
        ecma: 6,
        mangle: true
      },
      sourceMap: true
    }),
    new ExtractTextPlugin('css/critical.css'),
    new InlineStylePlugin('css/critical.css'),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: false,
      minify: {
        removeStyleLinkTypeAttributes: true,
        removeRedundantAttributes: true,
        removeEmptyAttributes: true,
        collapseWhitespace: true,
        removeComments: true,
        minifyURLs: true,
        minifyCSS: true,
        minifyJS: true
      }
    })
  ]
};
