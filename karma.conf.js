var customConfig = require('./customConfig')

module.exports = function (config) {
  config.set({
    browsers: [ 'Chrome' ],
    // karma only needs to know about the test bundle
    files: [
      'node_modules/babel-core/browser-polyfill.js',
      {
        pattern: 'tests.bundle.js',
        watched: true
      }
    ],
    frameworks: [ 'chai', 'mocha' ],
    plugins: [
      'karma-chrome-launcher',
      'karma-chai',
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-webpack',
    ],
    // run the bundle through the webpack and sourcemap plugins
    preprocessors: {
      'tests.bundle.js': [ 'webpack', 'sourcemap' ]
    },
    reporters: [ 'dots' ],
    usePolling: true,
    singleRun: false,
    // webpack config object
    webpack: { //kind of a copy of your webpack config
      devtool: 'inline-source-map', //just do inline source maps instead of the default
      plugins: customConfig.plugins,
      module: {
        loaders: [
          {
            test: /(\.js$)|(\.jsx$)/,
            exclude: /node_modules/,
            loaders: [
              'babel-loader'
            ]
          },
          {
            test: /\.json$/,
            loaders: ['json']
          },
          {
            test: /\.(otf|eot|svg|ttf|woff)/,
            loader: 'url-loader?limit=10000',
          },
          {
            test: /\.(jpe?g|png|gif)/,
            loader: 'url-loader?limit=10000',
          },
          {
            test: /\.ejs$/,
            loader: 'ejs-compiled-loader'
          },
          {
            test: /node_modules\/auth0-lock\/.*\.js$/,
            loaders: ['transform/cacheable?brfs', 'transform/cacheable?packageify']
          },
          {
            test: /\.css$/,
            loader: 'null-loader',
          },
        ],
      },
      resolve: customConfig.resolutions,
    },
    colors: true,
    autoWatch: true,
    webpackMiddleware: {
      noInfo: true,
    }
  });
};
