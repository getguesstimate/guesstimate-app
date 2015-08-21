var getConfig = require('hjs-webpack')
var webpack = require('webpack')
var path = require('path');

module.exports = getConfig({
  in: 'src/app.js',
  out: 'public',
  clearBeforeBuild: true
});

module.exports.node = {
  child_process: 'empty'
}

module.exports.devServer.host = '0.0.0.0'
module.exports.resolve.root = path.resolve('./src')
