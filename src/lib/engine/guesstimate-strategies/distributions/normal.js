import Stochator from 'stochator';
import AbstractDistribution from './abstract-distribution.js'

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
    const stochator = new Stochator({
      mean: formatted.low,
      stdev: formatted.high,
      seed: 0,
      min: -99999999999999
    });
    let results = stochator.next(n)
    results = Array.isArray(results) ? results : [results]
    return { values: results.map(n => n) }
  }
}

const symbols = ['+-', '-+', '±', '->', ':', '/']
const relevantSymbol = (input) => {return symbols.find(e => (input.includes(e)))}
const splitNumbersAt = (input, symbol) => { return input.split(symbol).map((e) => parseFloat(e.trim())); }

export var InputFormatter = {
  name: 'input',

  isValid(g) {
    if (!this.isA(g)) { return false }
    const numbers = this._numbers(g.input)
    return (isNumber(numbers[0]) && isNumber(numbers[1]))
  },

  isA(g) {
    if (!g || !g.input) { return false }
    return (this.inputSymbols(g.input).length >= 1)
  },

  format(g) {
    const numbers = this._numbers(g.input)
    return {low: numbers[0], high: numbers[1]}
  },

  _numbers(input) {
    const symbol = relevantSymbol(input)
    return splitNumbersAt(input, symbol)
  },

  inputSymbols(input) {
    return symbols.filter(e => (input.includes(e)))
  }
}

export var ManualFormatter = {
  name: 'manual',
  isA(g) { return (g.distributionType === 'NormalDistribution') },
  isValid(g) { return (!!this.isA(g) && isNumber(g.low) && isNumber(g.high)) },
  format(g) { return {low: parseFloat(g.low), high: parseFloat(g.high)} }
}

export var Distribution = new AbstractDistribution('normal', Formatter, Sampler)
