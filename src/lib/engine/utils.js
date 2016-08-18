import * as _collections from './collections'

const URL_REGEX = /(?:http(?:s?):\/\/)?(?:www)?\w+\.(?:[a-z]{2,})[\w\?\/\=\.\#]*/g

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
