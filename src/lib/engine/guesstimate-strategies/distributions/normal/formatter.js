import {InputPlusMinusFormatter, InputUpToFormatter} from './input-formatter.js'

function isNumber(s) {
  return !!(s && !isNaN(s.toString()))
}

export var Formatter = {
  isA(g) { return this._formatterType(g).isA() },
  format(g) { return this._formatterType(g).format() },
  errors(g) { return this._formatterType(g).errors() },

  _formatterType(g) {
    const UpTo = new InputPlusMinusFormatter(g)
    const PlusMinus = new InputUpToFormatter(g)
    const Manual = new ManualFormatter(g)

    if (UpTo.isA())           { return UpTo }
    else if (PlusMinus.isA()) { return PlusMinus }
    else                      { return Manual }
  }
}

export class ManualFormatter {
  constructor(g) {
    this.g = g;
    this.name = 'manual'
  }

  isA() { return (_.has(this.g, 'distributionType') && (this.g.distributionType === 'NormalDistribution')) }
  format() { return {low: parseFloat(this.g.low), high: parseFloat(this.g.high)} }
  errors() {
    const errs = []

    const validLow = isNumber(_.get(this, 'g.low'))
    const validHigh = isNumber(_.get(this, 'g.high'))

    if (!validLow) { errs.push('Low number is not valid') }
    if (!validHigh) { errs.push('High number is not valid') }

    if (!!validLow && !!validHigh && (this.g.low > this.g.high)) {
      errs.push('High number must be greater than low number')
    }
    return errs
  }
  isValid() { return (!!this.isA() && isNumber(this.g.low) && isNumber(this.g.high)) }
}
