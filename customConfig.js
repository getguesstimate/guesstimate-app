var webpack = require('webpack')
var path = require('path')
var lodash = require('lodash')

var useDevVariables = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  __API_ENV__: JSON.stringify(process.env.API_ENV || 'development')
})
var lodashPlugin = new webpack.ProvidePlugin({_: 'lodash'})

module.exports = {
  plugins: [useDevVariables, lodashPlugin],
  resolutions: {
    root: path.resolve('./src'),
    alias: {
      gComponents: path.resolve('./src/components'),
      gEngine: path.resolve('./src/lib/engine'),
      gModules: path.resolve('./src/modules'),
      lib: path.resolve('./src/lib'),
      servers: path.resolve('./src/server')
    },
    extensions: [
      '',
      '.js',
      '.jsx',
      '.json'
    ],
  },
}
