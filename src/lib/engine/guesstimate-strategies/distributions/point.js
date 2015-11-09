import AbstractDistribution from './abstract-distribution.js'

function isNumber(s) {
  return !!(s && !isNaN(s.toString()))
}

export var Formatter = {
  isA(g) { return this._relevantFormatter(g).isA(g) },
  format(g) { return this._relevantFormatter(g).format(g) },
  errors(g) { return this._relevantFormatter(g).errors(g) },
  _relevantFormatter(g) { return (InputFormatter.isA(g) ? InputFormatter : ManualFormatter) },
}

export var Sampler = {
  sample(formatted) {
    return {values: [formatted.value]}
  }
}

export var InputFormatter = {
  name: 'input',
  isA(g) { return (!!g.input && isNumber(g.input)) },
  format(g) { return {value: parseFloat(g.input)} },
  errors(g) {
    const errs = []
    if (!g.input || !isNumber(g.input)) {
      errs.push('Must have valid number')
    }
    return errs
  }
}

export var ManualFormatter = {
  name: 'manual',
  isA(g) { return (g.distributionType === 'PointDistribution') },
  format(g) { return {value: parseFloat(g.value)} },
  errors(g) {
    const errs = []
    if (!g.value || !isNumber(g.value)) {
      errs.push('Must have valid number')
    }
    return errs
  }
}

export var Distribution = new AbstractDistribution('point', Formatter, Sampler)
