import {confidenceIntervalTextMixin} from './lib.js'

export const item = Object.assign(
  {}, confidenceIntervalTextMixin,
  {
    inputType: 'TEXT',
    formatterName: 'DISTRIBUTION_PROPORTIONALITY',

    matches(text) { return !!text && _.isString(text) && text.includes(" of ") },

    _numbers(text) { return this._splitNumbersAt(text, " of ") },

    format(g) {
      const [hits, total] = this._numbers(g.text)
      const guesstimateType = this.guesstimateType(g, low)
      return {guesstimateType, hits, total}
    }
  }
)
