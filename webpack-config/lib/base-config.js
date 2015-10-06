var autoPrefixer = require('autoprefixer')
var HtmlPlugin = require('./html-plugin')
var pick = require('lodash.pick')
var webpack = require('webpack')

var useDevVariable = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
});

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
    plugins: [
      new HtmlPlugin(pick(spec, [
        'html',
        'isDev',
        'serveCustomHtmlInDev',
        'package'
      ])),
      useDevVariable
    ],
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
        }
      ]
    },
    postcss: function() {
      return [autoPrefixer]
    }
  }
}
