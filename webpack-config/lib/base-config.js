var autoPrefixer = require('autoprefixer')
var HtmlPlugin = require('./html-plugin')
var atImport = require('postcss-import')
var webpack = require('webpack')
var jQuery = require('jquery')
var precss = require('precss')
var lodash = require('lodash')
var localPlugins = require('../../plugins')

module.exports = function getBaseConfig (spec) {
  return {
    entry: [
      'babel/polyfill',
      spec.entry
    ],
    node: {
      child_process: 'empty'
    },
    output: spec.output,
    resolve: {
      extensions: [
        '',
        '.js',
        '.jsx',
        '.json'
      ]
    },
    plugins: localPlugins.concat(
      new HtmlPlugin(lodash.pick(spec, [
        'html',
        'isDev',
        'serveCustomHtmlInDev',
        'package'
      ]))
    ),
    module: {
      loaders: [
        {
          test: /(\.js$)|(\.jsx$)/,
          exclude: /node_modules/,
          loaders: [
            'babel-loader'
          ]
        },
        {
          test: /\.json$/,
          loaders: ['json']
        },
        {
          test: /\.(otf|eot|svg|ttf|woff)/,
          loader: 'url-loader?limit=' + spec.urlLoaderLimit
        },
        {
          test: /\.(jpe?g|png|gif)/,
          loader: 'url-loader?limit=' + spec.urlLoaderLimit
        },
        {
          test: /\.ejs$/,
          loader: 'ejs-compiled-loader'
        },
        {
          test: /node_modules\/auth0-lock\/.*\.js$/,
          loaders: ['transform/cacheable?brfs', 'transform/cacheable?packageify']
        }
      ]
    },
    postcss: [
      atImport({
        path: ['node_modules', './src']
      }),
      precss(),
      autoPrefixer()
    ]
  }
}
