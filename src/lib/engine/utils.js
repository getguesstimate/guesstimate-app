import * as _collections from './collections'

export const typeSafeEq = (x, y) => x.toString() === y.toString()
export const orStr = e => e || ''
export const orArr = e => e || []

const escSpecialChars = str => str.replace(/\$|\{|\}|\_/g, e => `\\${e}`)
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
