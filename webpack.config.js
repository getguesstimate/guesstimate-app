var getConfig = require('hjs-webpack')
var webpack = require('webpack')
var path = require('path');

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
});


var cfg = getConfig({
  in: 'src/app.js',
  out: 'public',
  clearBeforeBuild: true,
});

cfg.node = {
  child_process: 'empty'
};

cfg.entry = ['babel/polyfill'].concat(cfg.entry);
if(process.env.NODE_ENV === 'development'){
	cfg.devServer.host = '0.0.0.0';
	//uncomment to suppress log output
	//module.exports.devServer.noInfo = true;
	//module.exports.devServer.quiet=true;
}

cfg.resolve.root = path.resolve('./src');
cfg.resolve.extensions.push('.ts');
cfg.resolve.extensions.push('.tsx');

cfg.plugins = cfg.plugins.concat(definePlugin);

module.exports = cfg;
