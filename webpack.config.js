var getConfig = require('hjs-webpack')

module.exports = getConfig({
  in: 'src/app.js',
  out: 'public',
  clearBeforeBuild: true,
  hostName: 'ozzie-Elitebook.local'
})
