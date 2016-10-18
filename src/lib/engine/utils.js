import * as _collections from './collections'

// Source: https://gist.github.com/dperini/729294
export const URL_REGEX = /(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[\/?#]\S*)?/i

const isImmutable = e => !!_.get(e, '__immutable_invariants_hold') && _.has(e, 'asMutable')
export const mutableCopy = (e, deep=false) => isImmutable(e) ? e.asMutable() : deep ? _.cloneDeep(e) : _.clone(e)

export const typeSafeEq = (x, y) => !x ? !y : !!y && x.toString() === y.toString()
export const orStr = e => e || ''
export const orZero = e => e || 0
export const orArr = e => e || []

export const isPresent = e => (!!e && !_.isEmpty(e)) || (typeof e === 'number') || (e === true)
export const presentOrVal = (e, val) => isPresent(e) ? e : val
export const allPresent = (...objs) => objs.reduce((running, curr) => running && isPresent(curr), true)
export const allPropsPresent = (obj, ...props) => allPresent(...props.map(p => _.get(obj, p)))

export const notIn = list => e => !list.includes(e)

export const getClassName = (...classes) => classes.filter(isPresent).join(' ')

const escSpecialChars = str => str.replace(/\$|\{|\}|\_/g, e => `\\${e}`)
const toSource = re => re instanceof RegExp ? re.source : escSpecialChars(re)
const parenthesize = str => `(?:${str})`
export function or(res) {
  const strParts = res.map(toSource).filter(isPresent).map(parenthesize)
  const lengthSorted = _.sortBy(strParts, prt => -prt.length) // To avoid partial replacements.
  return new RegExp(parenthesize(lengthSorted.join('|')), 'g')
}

export function replaceByMap(str, replacementMap) {
  if (!str || _.isEmpty(str) || _.isEmpty(replacementMap)) { return str }
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

export const indicesOf = (list, predFn) => list.map((e, i) => predFn(e) ? i : null).filter(e => _.isFinite(e))
export function getSubMatches(str, regex, matchIndex) {
  if (_.isEmpty(str)) { return [] }
  let matches = []
  let match
  while (match = regex.exec(str)) { matches.push(match[matchIndex]) }
  return matches
}
