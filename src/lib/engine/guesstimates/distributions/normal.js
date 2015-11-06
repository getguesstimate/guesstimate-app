//import AbstractDistribution from './abstract-distribution.js'

//export default Distribution = new AbstractDistribution('normal', Formatter, Sampler)

function isNumber(s) {
  return !!(s && !isNaN(s.toString()))
}

export var Formatter = {
  isA(g) { return this._relevantFormatter(g).isA(g) },
  isValid(g) { return this._relevantFormatter(g).isValid(g) },
  format(g) { return this._relevantFormatter(g).format(g) },
  _relevantFormatter(g) { return (InputFormatter.isA(g) ? InputFormatter : ManualFormatter) },
}

export var Sampler = {
  sample(formatted, n) {
    return {values: [formatted.value]}
  }
}


const symbols = ['+-', '-+', '±', '->', ':']
const relevantSymbol = (input) => {return symbols.find(e => (g.input.includes(e)))}
const splitNumbersAt = (input, symbol) => { return input.split(symbol).map((e) => parseFloat(e.trim())); }

export var InputFormatter = {
  name: 'input',

  isValid(g) {
    if (!this.isA(g)) { return false }
    const numbers = this._numbers(g.input)
    return (isNumber(numbers[0]) && isNumber(numbers[1]))
  },

  isA(g) {
    if (!g.input) { return false }
    return (symbols.filter(e => (g.input.includes(e))).length === 1)
  },

  format(g) {
    const numbers = this._numbers(g.input)
    return {low: numbers[0], high: numbers[1]}
  },

  _numbers(input) {
    const symbol = relevantSymbol(input)
    const numbers = splitNumbersAt(input, symbol)
  }
}

export var ManualFormatter = {
  name: 'manual',
  isA(g) { return (g.distributionType === 'NormalDistribution') },
  isValid(g) { return (!!this.isA(g) && isNumber(g.low) && isNumber(g.high)) },
  format(g) { return {low: parseFloat(g.low), high: parseFloat(g.high)} }
}
