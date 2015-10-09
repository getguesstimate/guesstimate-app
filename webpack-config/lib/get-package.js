var fs = require('fs')
var path = require('path')
var findRoot = require('find-root')
var rootFolder = findRoot(process.cwd())

module.exports = function (pack) {
  var result = getPackage(pack)

  if (!result.version) {
    throw new Error('package.json has no `version` property')
  }

  if (!result.name) {
    throw new Error('package.json has no `name` property')
  }
  return result
}

function getPackage (pack) {
  if (typeof pack === 'string') {
    // see if it's JSON
    try {
      return JSON.parse(pack)
    } catch (e) {
      // see if it's a filepath to the package.json file
      try {
        return JSON.parse(fs.readFileSync(path.resolve(pack), 'utf-8'))
      } catch (e) {}
    }
  } else if (pack == null) {
    // try to read it
    try {
      return JSON.parse(fs.readFileSync(path.join(rootFolder, 'package.json'), 'utf-8'))
    } catch (e) {
      throw new Error('Could not find package.json')
    }
  }

  // return the original in case
  // it was already an object.
  return pack
}
