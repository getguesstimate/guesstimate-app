module.exports = function (name) {
  try {
    require.resolve(name)
    return true
  } catch (e) {
    return false
  }
}
