var getConfig = require('hjs-webpack')
var webpack = require('webpack')
var path = require('path');

module.exports = getConfig({
  in: 'src/app.js',
  out: 'public',
  clearBeforeBuild: true,
});

module.exports.node = {
  child_process: 'empty'
}

if(process.env.NODE_ENV === 'development'){ 
	module.exports.devServer.host = '0.0.0.0'
}

//uncomment to suppress log output
//module.exports.devServer.noInfo = true;
//module.exports.devServer.quiet=true;
module.exports.resolve.root = path.resolve('./src')
