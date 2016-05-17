import {parseNumber} from './lib.js'

export const item = {
  inputType: 'TEXT',
  formatterName: 'DISTRIBUTION_PROPORTIONALITY',

  separators: [' of ', ' in '],

  errors(g) {
    const numbers = this._numbers(g.text)
    if (numbers.length !== 2) {
      return ['only accepts two numbers']
    } else if (numbers[1] < numbers[0]) {
      return ['the second number must be greater than the first number']
    }
    return []
  },

  matchingSep(text) { return _.find(this.separators, s => text.includes(s)) },

  matches({text}) { return !!text && _.isString(text) && !!this.matchingSep(text) },

  _numbers(text) { return text.split(this.matchingSep(text)).map(e => parseNumber(e.trim())) },

  format(g) {
    const [hits, total] = this._numbers(g.text)
    const guesstimateType = "BETA"
    return {guesstimateType, hits, total}
  }
}

