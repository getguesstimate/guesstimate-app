var getConfig = require('./webpack-config')

var path = require('path');

var elev = `<script> var _elev = window._elev || {};(function() {
      var i,e;i=document.createElement("script"),i.type='text/javascript';i.async=1,i.src="https://static.elev.io/js/v3.js",e=document.getElementsByTagName("script")[0],e.parentNode.insertBefore(i,e);})();
      _elev.account_id = '565e550e67ffc'</script>`

var wistia = `<script charSet="ISO-8859-1" src="//fast.wistia.com/assets/external/E-v1.js" async></script>`
var twitter = `<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>`
var fonts = `<link href='https://fonts.googleapis.com/css?family=Lato:400,700,300' rel='stylesheet' type='text/css'>`
var googleTags = `<meta name='Description' content="A spreadsheet for things that aren't certain"/>`
var chargebee = `<script type="text/javascript" src="https://js.chargebee.com/v1/chargebee.js"></script>`
var ogtags = ''
             + `<meta property="og:type" content="product"/>`
             + `<meta property="og:title" content="Guesstimate"/>`
             + `<meta property="og:description" content="A spreadsheet for things that aren't certain"/>`

var head = googleTags + ogtags + elev + wistia + twitter + fonts + chargebee

var meta = {name: 'Guesstimate', content: `A spreadsheet for things that aren't certain`}

var cfg = getConfig({
  in: 'src/routes/app.js',
  out: 'public',
  clearBeforeBuild: true,
  html: function (context) {
    return {
      '200.html': context.defaultTemplate({title: 'Guesstimate', head, meta}),
      'index.html': context.defaultTemplate({title:'Guesstimate', head, meta})
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
