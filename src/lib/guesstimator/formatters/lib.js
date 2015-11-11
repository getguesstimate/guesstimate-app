export function parseNumber(n) { return parseFloat(n) }
export function isParseableNumber(n) { return !!(n && !isNaN(n.toString())) }

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
