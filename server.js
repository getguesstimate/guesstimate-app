var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

var express    = require('express');        // call express
var bodyParser = require('body-parser');
var app        = express();                 // define our app using express
var mongoose = require('mongoose');
var router = express.Router();              // get an instance of the express Router
mongoose.connect('mongodb://oagr:password@proximus.modulusmongo.net:27017/tas3uZuj');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
var comments = [{author: 'Pete Hunt', text: 'Hey there!'}];

app.all('/', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  console.log(res)
  next();
});

app.get('/comments.json', function(req, res) {
   res.setHeader('Content-Type', 'application/json');
   res.send(JSON.stringify(comments));
});

app.post('/comments.json', function(req, res) {
   res.send(JSON.stringify(comments));
 });

app.listen(3001);

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true
}).listen(3000, '0.0.0.0', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:3000');
});
