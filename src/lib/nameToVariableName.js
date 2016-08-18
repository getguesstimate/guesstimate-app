const readableIdPartFromWord = word => (/^\d+$/).test(word) ? word : word[0]
function getDirectVariableNameFromName(rawName, maxOneWordLength, maxSplitWordLength) {
  const name = rawName.trim().toLowerCase().replace(/[^\w\d]/g, ' ').replace(/\s/g, '_')
  const words = name.split(/[\_]/).filter(s => !_.isEmpty(s))
  if (words.length === 1 && name.length < maxOneWordLength) {
    return name
  } else if (words.length < maxSplitWordLength) {
    return name.slice(0, maxSplitWordLength)
  } else {
    return words.map(readableIdPartFromWord).join('')
  }
}

export function getVariableNameFromName(rawName, existingVariableNames=[], maxOneWordLength=30, maxSplitWordLength=8) {
  const directName = getDirectVariableNameFromName(rawName, maxOneWordLength, maxSplitWordLength)

  const nameRegex = new RegExp(`${directName}(?:_(\d+))?`, 'gi')

  const matchingNames = existingVariableNames.filter(v => nameRegex.test(v))
  if (_.isEmpty(matchingNames)) { return directName }

  const currentMaxSuffix = Math.max(...matchingNames.map(v => parseInt(v.match(nameRegex)[1] || '0')))
  return `${directName}${currentMaxSuffix + 1}`
}
