var getConfig = require('./webpack-config')

var path = require('path');

var cfg = getConfig({
  in: 'src/routes/app.js',
  out: 'public',
  clearBeforeBuild: true,
  html: function (context) {
    return {
      '200.html': context.defaultTemplate({title: 'Guesstimate'}),
      'index.html': context.defaultTemplate({title:'Guesstimate'})
    }
  }
});

if(process.env.NODE_ENV === 'development'){
	cfg.devServer.host = '0.0.0.0';
	//uncomment to suppress log output
	//module.exports.devServer.noInfo = true;
	//module.exports.devServer.quiet=true;
}

cfg.resolve.root = path.resolve('./src');
cfg.resolve.alias = {
  gComponents: path.resolve('./src/components'),
  gEngine: path.resolve('./src/lib/engine'),
  gModules: path.resolve('./src/modules'),
  lib: path.resolve('./src/lib'),
  servers: path.resolve('./src/server')
};

module.exports = cfg;
