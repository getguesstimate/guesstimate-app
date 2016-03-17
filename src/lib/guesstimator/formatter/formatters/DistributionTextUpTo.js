import {normalTextMixin} from './lib.js'

// TODO(matthew): Can we get rid of this????

export const item = Object.assign(
  {}, normalTextMixin,
  {
    inputType: 'TEXT',
    formatterName: 'DISTRIBUTION_NORMAL_TEXT_UPTO',
    _symbols: ['->', ':'],
    _numbers(text) { return this._splitNumbersAt(text, this._relevantSymbol(text)) },
    format(g) {
      const [low, high] = this._numbers(g.text)
      if (!(isNaN(low) || isNaN(high))) {
        const guesstimateType = this.guesstimateType(g, low > 0 ? 'LOGNORMAL' : 'NORMAL')
        return {guesstimateType, low, high }
      }
      return {}
    }
  }
)
