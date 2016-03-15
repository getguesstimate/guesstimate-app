export function parseNumber(n) { return parseFloat(n) }

export function isParseableNumber(n) {
  if (_.isString(n)){
    return !isNaN(n)
  } else {
    return _.isFinite(n)
  }
}

export const graphicalMixin = {
  matches(g) {
    return g.guesstimateType === this.guesstimateType
  },

  format(g) {
    let output = {guesstimateType: this.guesstimateType}
    this.relevantNumbers.map(e => {output[e.name] = parseNumber(g[e.name])})
    return output
  },

  errors(g) {
    const required = this.relevantNumbers.filter(e => e.required)
    const requiredAndUnparseable = required.filter(r => !isParseable(g[r]))
    return requiredAndUnparseable.map(e => `Unable to parse required attribute ${e.name}`)
  }
}

export const textMixin = {
  matches(g) {
    return (this._hasText(g) && this._matchesText(g.text))
  },

  _hasText(g) {
    return !!(g.text && _.isString(g.text))
  }
}

export const normalTextMixin = Object.assign(
  {}, textMixin,
  {
    errors(g) { return this._normalTextErrors(g.text) },
    guesstimateType(g) {
      switch (g.guesstimateType) {
        case 'UNIFORM':
          return g.guesstimateType
        case 'NORMAL':
          return g.guesstimateType
        case 'LOGNORMAL':
          return g.guesstimateType
        default:
          return 'NORMAL'
      }
    },
    _matchesText(text) { return this._hasRelevantSymbol(text) },
    _normalTextErrors(text) {
      if (this._inputSymbols(text).length > 1) { return ['Must contain only 1 symbol'] }

      const numbers = this._numbers(text)
      if (numbers.length !== 2) { return ['Must contain 2 inputs'] }
      if (!_.every(numbers, (e) => isParseableNumber(e))) { return ['Not all numbers are parseable'] }
      if (numbers[0] >= numbers[1]) { return ['Low number must be first'] }

      return []
    },

    _inputSymbols(text) { return this._symbols.filter(e => (text.includes(e))) },
    _relevantSymbol(text) { return this._inputSymbols(text)[0] },
    _hasRelevantSymbol(text) { return (this._inputSymbols(text).length > 0) },
    _splitNumbersAt(text, symbol) { return text.split(symbol).map((e) => parseNumber(e.trim())); }
  }
)
