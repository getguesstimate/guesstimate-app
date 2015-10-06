var ExtractTextPlugin = require('extract-text-webpack-plugin')

// All optional loader plugins are listed here
// `pkg` is the npm name of the loader
// `config` contains a webpack loader config for development and production
module.exports = [
  {
    pkg: 'stylus-loader',
    config: {
      dev: {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!postcss-loader!stylus-loader'
      },
      production: {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!stylus-loader')
      }
    }
  },
  {
    pkg: 'less-loader',
    config: {
      dev: {
        test: /\.less$/,
        loader: 'style-loader!css-loader!postcss-loader!less-loader'
      },
      production: {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!less-loader')
      }
    }
  },
  {
    pkg: 'sass-loader',
    config: {
      dev: {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader'
      },
      production: {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader')
      }
    }
  },
  {
    pkg: 'sass-loader',
    config: {
      dev: {
        test: /\.sass$/,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader?indentedSyntax'
      },
      production: {
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader?indentedSyntax')
      }
    }
  }
]
