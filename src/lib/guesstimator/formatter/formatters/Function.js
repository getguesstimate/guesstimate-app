import {textMixin, isParseableNumber, parseNumber} from './lib.js'

export const item = Object.assign(
  {}, textMixin,
  {
    guesstimateType: 'FUNCTION',
    inputType: 'TEXT',
    formatterName: 'FUNCTION',
    _matchesText(text) { return (text[0] === '=') },

    format(g) {
      return {
        guesstimateType: this.guesstimateType,
        text: this._formatText(g.text),
      }
    },

    errors(g) {return []},
    _formatText(text) { return text.substring(1, text.length) },
  }
)
