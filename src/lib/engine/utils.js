import * as _collections from './collections'

// Source: https://gist.github.com/dperini/729294
export const URL_REGEX = /(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[\/?#]\S*)?/i

export const typeSafeEq = (x, y) => x.toString() === y.toString()
export const orStr = e => e || ''
export const orArr = e => e || []

const escSpecialChars = str => str.replace(/\$|\{|\}/g, e => `\\${e}`)
const toSource = re => re instanceof RegExp ? re.source : escSpecialChars(re)
const parenthesize = str => `(?:${str})`
export function or(res) {
  const strParts = res.map(toSource).filter(_collections.isPresent).map(parenthesize)
  const lengthSorted = _.sortBy(strParts, prt => -prt.length) // To avoid partial replacements.
  return new RegExp(parenthesize(lengthSorted.join('|')), 'g')
}

export function replaceByMap(str, replacementMap) {
  const regex = or(Object.keys(replacementMap))
  return str.replace(regex, match => replacementMap[match])
}

export function makeURLsMarkdown(text) {
  const fullRegex = new RegExp(`\\[.+\\]\\(${URL_REGEX.source}\\)`, 'g')
  let transformedText = ''
  let prevIndex = 0
  let matchArr
  while ((matchArr = fullRegex.exec(text)) !== null) {
    const partial = text.slice(prevIndex, matchArr.index)
    transformedText += partial.replace(URL_REGEX, match => `[${match}](${match})`)
    transformedText += matchArr[0]
    prevIndex = matchArr.index + matchArr[0].length
  }
  const partial = text.slice(prevIndex)
  transformedText += partial.replace(URL_REGEX, match => `[${match}](${match})`)

  return transformedText
}
