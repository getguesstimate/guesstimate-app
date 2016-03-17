import {normalTextMixin} from './lib.js'

export const item = Object.assign(
  {}, normalTextMixin,
  {
    inputType: 'TEXT',
    formatterName: 'DISTRIBUTION_NORMAL_TEXT_UPTO',
    _symbols: ['->', ':'],
    _numbers(text) { return this._splitNumbersAt(text, this._relevantSymbol(text)) },
    format(g) {
      const guesstimateType = this.guesstimateType(g)
      const [low, high] = this._numbers(g.text)
      return {precision: 2, guesstimateType, low, high }
    }
  }
)
