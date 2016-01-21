import {textMixin, isParseableNumber, parseNumber} from './lib.js'

export const item = {
    guesstimateType: 'DATA',
    inputType: 'TEXT',
    formatterName: 'DATA',

    format(g) {
      return {
        guesstimateType: this.guesstimateType,
        value: g.value
      }
    },
    matches(g) { return true },
    errors(g) {return []},
  }

