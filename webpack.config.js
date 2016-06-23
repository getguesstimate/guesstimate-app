var getConfig = require('./webpack-config')
var customConfig = require('./customConfig')

var elev = `<script> var _elev = window._elev || {};(function() {
      var i,e;i=document.createElement("script"),i.type='text/javascript';i.async=1,i.src="https://static.elev.io/js/v3.js",e=document.getElementsByTagName("script")[0],e.parentNode.insertBefore(i,e);})();
      _elev.account_id = '565e550e67ffc'</script>`

var description = "Plan finances, make strategic decisions, and do risk assessment.  Guesstimate uses stochastic models, Monte Carlo simulations, and sensitivity analyses."
var name = "Guesstimate | A Spreadsheet for the Uncertain"
var wistia = `<script charSet="ISO-8859-1" src="//fast.wistia.com/assets/external/E-v1.js" async></script>`
var twitter = `<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>`
var fonts = `<link href='https://fonts.googleapis.com/css?family=Lato:400,700,300' rel='stylesheet' type='text/css'>`
var favicon = `<link rel='icon' type='image/png' href='/favicon.png' />`
var chargebee = `<script type="text/javascript" src="https://js.chargebee.com/v1/chargebee.js"></script>`
var escapedFragments = `<meta name="fragment" content="!">`

var head = elev + wistia + twitter + fonts + favicon + chargebee + escapedFragments

var meta = {name: name, content: description}

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

cfg.resolve.root = customConfig.resolutions.root
cfg.resolve.alias = customConfig.resolutions.alias

module.exports = cfg;
