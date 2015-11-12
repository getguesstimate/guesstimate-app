import {item as Funct} from './formatters/Function.js'
import {item as DistributionNormalTextUpTo} from './formatters/DistributionNormalTextUpTo.js'
import {item as DistributionNormalTextPlusMinus} from './formatters/DistributionNormalTextPlusMinus.js'
import {item as DistributionPointGraphical} from './formatters/DistributionPointGraphical.js'
import {item as DistributionPointText} from './formatters/DistributionPointText.js'

export const formatters = [
  Funct,
  DistributionNormalTextUpTo,
  DistributionNormalTextPlusMinus,
  DistributionPointGraphical,
  DistributionPointText,
]

export function _matchingFormatter(g) {
  const inputType = _.isString(g.text) ? 'TEXT' : 'GRAPHICAL'
  let filtered = formatters.filter(f => f.inputType === inputType)
  return _tryFormattersForMatch(g, filtered)
}

function _tryFormattersForMatch(g, formatters) {
  for(let formatter of formatters) {
    if (formatter.matches(g)) {
      return formatter
    }
  }
  return null
}

export function format(g) {
  const formatter = _matchingFormatter(g)
  return formatter.format(g)
}
