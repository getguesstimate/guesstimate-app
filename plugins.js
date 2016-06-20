var webpack = require('webpack')
var lodash = require('lodash')

var useDevVariables = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  __API_ENV__: JSON.stringify(process.env.API_ENV || 'development'),
  __SEGMENT_API_ENV__: JSON.stringify(process.env.SEGMENT_API_ENV || 'development'),
})
var lodashPlugin = new webpack.ProvidePlugin({_: 'lodash'})

module.exports = [useDevVariables, lodashPlugin]
