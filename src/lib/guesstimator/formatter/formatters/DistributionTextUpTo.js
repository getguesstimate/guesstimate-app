import {confidenceIntervalTextMixin} from './lib.js'

export const item = Object.assign(
  {}, confidenceIntervalTextMixin,
  {
    inputType: 'TEXT',
    formatterName: 'DISTRIBUTION_NORMAL_TEXT_UPTO',
    _symbols: ['->', ':', '..', ' to '],
    _numbers(text) { return this._splitNumbersAt(text, this._relevantSymbol(text)) },
    format(g) {
      const [low, high] = this._numbers(g.text)
      const guesstimateType = this.guesstimateType(g, low)
      return {guesstimateType, low, high}
    }
  }
)
