import {textMixin, isNumber} from './lib.js'

export const item = Object.assign(
  textMixin,
  {
    guesstimateType: 'NORMAL',
    inputType: 'TEXT',
    errors() { return [] },
    _matchesText(text) { return isNumber(text) }
  }
)
