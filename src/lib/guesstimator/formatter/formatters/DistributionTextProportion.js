import {parseNumber} from './lib.js'

export const item = {
  inputType: 'TEXT',
  formatterName: 'DISTRIBUTION_PROPORTIONALITY',

  errors(g) {
    const numbers = this._numbers(g.text)
    if (numbers.length !== 2) {
      return ['only accepts two numbers']
    } else if (numbers[1] < numbers[0]) {
      return ['the second number must be greater than the first number']
    }
    return []
  },

  matches({text}) { return !!text && _.isString(text) && text.includes(" of ") },

  _numbers(text) { return text.split(" of ").map(e => parseNumber(e.trim())) },

  format(g) {
    const [hits, total] = this._numbers(g.text)
    const guesstimateType = "BETA"
    return {guesstimateType, hits, total}
  }
}

