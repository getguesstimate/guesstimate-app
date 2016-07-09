import {textMixin, isParseableNumber, parseNumber} from './lib.js'

export function formatData(value) {
  return value
    .replace(/[\[\]]/g, '')
    .split(/[\n\s,]+/)
    .filter(e => !_.isEmpty(e))
    .map(Number)
    .filter(e => _.isFinite(e))
    .slice(0, 10000)
}

export const isData = input => !input.includes('=') && (input.match(/[\n\s,]/g) || []).length > 3

export const item = {
  guesstimateType: 'DATA',
  inputType: 'TEXT',
  formatterName: 'DATA',

  format(g) {
    return {
      guesstimateType: this.guesstimateType,
      data: g.data
    }
  },
  matches(g) { return !!g.data },
  errors(g) {return []},
}
