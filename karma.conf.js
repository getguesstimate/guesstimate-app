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
      module: {
        loaders: [
          { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
          {
            test: /\.(jpe?g|png|gif)/,
            loader: 'url-loader?limit=1000'
          }
        ]
      }
    },
    colors: true,
    autoWatch: true,
    webpackMiddleware: {
      noInfo: true,
    }
  });
};
