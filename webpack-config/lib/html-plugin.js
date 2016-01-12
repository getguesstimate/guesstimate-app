var assign = require('lodash.assign')

// helper for generating default HTML
function defaultHtml (incomingData) {
  var data = assign({
    charset: 'utf-8',
    metaViewport: true,
    html: '',
    relative: false
  }, incomingData)
  var sep = data.relative ? '' : '/'
  var result = ['<!doctype html>']
  var add = function () {
    result.push.apply(result, arguments)
  }

  add('<head>')
  add('<meta charset="' + data.charset + '"/>')
  if (data.metaViewport !== false) {
    add('<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>')

  }
  if (data.metaTags) {
    for (var key in data.metaTags) {
      add('<meta name="' + key + '" content="' + data.metaTags[key] + '"/>')
    }
  }
  if (data.title) {
    add('<title>' + data.title + '</title>')
  }
  if (data.css) {
    add('<link rel="stylesheet" href="' + sep + data.css + '"/>')
  }
  if (data.head) {
    add(data.head)
  }

  add(`<script charSet="ISO-8859-1" src="//fast.wistia.com/assets/external/E-v1.js" async></script>`)
  add(`<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>`)

  add(`<link href='https://fonts.googleapis.com/css?family=Lato:400,700,300' rel='stylesheet' type='text/css'>`)
  add('</head>')
  add('<body>')
  add('<div id="root">')
  add('</div>')
  add('</body>')
  add('<script src="' + sep + data.main + '"></script>')
  return result.join('')
}

// Main export
function HJSPlugin (options) {
  this.config = options || {}
  this.filename = options.filename || 'index.html'
}

HJSPlugin.prototype.apply = function (compiler) {
  var self = this
  var htmlFunction = this.config.html
  var isDev = this.config.isDev
  var serveCustomHtmlInDev = this.config.serveCustomHtmlInDev

  // let user pass `true` to use
  // the simple default
  // Same if `isDev` and `serveCustomHtmlInDev` is falsy
  if (htmlFunction === true || (!serveCustomHtmlInDev && isDev)) {
    htmlFunction = defaultHtml
  } else if (!htmlFunction) {
    return
  }

  self.compiler = compiler

  compiler.plugin('emit', function (compiler, callback) {
    // store stats on self
    self.stats = compiler.getStats().toJson()
    var context = self.getAssets()

    // attach default template renderer
    // this is useful if you want default
    // html but want to create multiple or
    // differently named HTML files
    context.defaultTemplate = function (opts) {
      var templateData = assign({}, context, opts)
      return defaultHtml(templateData)
    }

    // access to package info
    context.package = self.config.package

    // access to stats
    context.stats = self.stats

    // expose `isDev` flag to html function context
    context.isDev = self.config.isDev

    // handle both sync and async versions
    if (htmlFunction.length === 2) {
      htmlFunction(context, function (err, result) {
        if (err) throw err
        self.addAssets(compiler, result)
        callback()
      })
    } else {
      self.addAssets(compiler, htmlFunction(context))
      callback()
    }
  })
}

// Oddly enough we have to pass in the compiler here
// it's changed from when it was stored on `this` previously
HJSPlugin.prototype.addAssets = function (compiler, data) {
  var dataType = typeof data
  var pages
  // if it's a string, we assume it's an html
  // string for the index file
  if (dataType === 'string') {
    pages = {}
    pages[this.filename] = data
  } else if (dataType === 'object') {
    pages = data
  } else {
    throw new Error('Result from `html` callback must be a string or an object')
  }

  for (var name in pages) {
    compiler.assets[name] = (function (asset) {
      return {
        source: function () {
          return asset
        },
        size: function () {
          return asset.length
        }
      }
    }(pages[name]))
  }
}

HJSPlugin.prototype.getAssets = function () {
  var assets = this.assets = {}
  var value, chunk

  for (chunk in this.stats.assetsByChunkName) {
    value = this.stats.assetsByChunkName[chunk]

    // Webpack outputs an array for each chunk when using sourcemaps
    if (value instanceof Array) {
      // if we've got a CSS file add it here
      if (chunk === 'main' && value.length === 2) {
        assets.css = value[1]
      }

      // Is the main bundle seems like it's always the first
      value = value[0]
    }

    assets[chunk] = value
  }

  return assets
}

module.exports = HJSPlugin
