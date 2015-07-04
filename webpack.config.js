var getConfig = require('hjs-webpack')
var webpack = require('webpack')

module.exports = getConfig({
  in: 'src/app.js',
  out: 'public',
  clearBeforeBuild: true,
  hostName: 'ozzie-Elitebook.local'
});

module.exports.node = {
  child_process: 'empty'
}

