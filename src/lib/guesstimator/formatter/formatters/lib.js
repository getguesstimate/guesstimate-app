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
    guesstimateType(g) { return g.guesstimateType || 'NORMAL' },
    _matchesText(text) { return this._hasRelevantSymbol(text) },
    _normalTextErrors(text) {
      let errs = []
      if (this._inputSymbols(text).length > 1) { errs.push('Must contain only 1 symbol') }
      if (!_.all(this._numbers(text), (e) => isParseableNumber(e))) { errs.push('Not all numbers are parseable') }
      else if (this._numbers(text)[0] >= this._numbers(text)[1]) { errs.push('Low -> High') }

      return errs
    },

    _numbers(text) { return this._splitNumbersAt(text, this._relevantSymbol(text)) },
    _inputSymbols(text) { return this._symbols.filter(e => (text.includes(e))) },
    _splitNumbersAt(text, symbol) { return text.split(symbol).map((e) => parseNumber(e.trim())); },
    _relevantSymbol(text) { return this._inputSymbols(text)[0] },
    _hasRelevantSymbol(text) { return (this._inputSymbols(text).length > 0) }
  }
)
