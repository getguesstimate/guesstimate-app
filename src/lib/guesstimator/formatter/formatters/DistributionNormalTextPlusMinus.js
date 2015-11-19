import {normalTextMixin} from './lib.js'

export const item = Object.assign(
  {}, normalTextMixin,
  {
    guesstimateType: 'NORMAL',
    inputType: 'TEXT',
    formatterName: 'DISTRIBUTION_NORMAL_TEXT_PLUS_MINUS',
    _symbols: ['+-', '-+', '±'],
    format(g) {
      const guesstimateType = this.guesstimateType
      const [mean, stdev] = this._numbers(g.text)
      return {
        guesstimateType,
        low: mean - stdev,
        high: mean + stdev
      }
    }
  }
)
