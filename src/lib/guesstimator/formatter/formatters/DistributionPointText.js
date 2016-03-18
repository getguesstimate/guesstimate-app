import {textMixin, isParseableNumber, parseNumber} from './lib.js'

export const item = Object.assign(
  {}, textMixin,
  {
    guesstimateType: 'POINT',
    inputType: 'TEXT',
    formatterName: 'DISTRIBUTION_POINT_TEXT',
    errors(g) { return [] },
    format(g) {
      const {guesstimateType} = this
      const value = parseNumber(g.text)
      return {precision: 6, guesstimateType, value}
    },
    _matchesText(g) { return true },
  }
)
