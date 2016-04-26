import {textMixin, isParseableNumber, parseNumber} from './lib.js'

export const item = Object.assign(
  {}, textMixin,
  {
    guesstimateType: 'POINT',
    inputType: 'TEXT',
    formatterName: 'DISTRIBUTION_POINT_TEXT',
    errors(g) {
      const value = parseNumber(g.text)
      if (!value || !isParseableNumber(value)) {
        return ['Invalid sample']
      }
      return []
    },
    format(g) {
      const {guesstimateType} = this
      const value = parseNumber(g.text)
      return {guesstimateType, value}
    },
    _matchesText(g) { return true },
  }
)
