function isNumber(s) {
  return !!(s && !isNaN(s.toString()))
}

const symbols = [
  {symbol: '+-', funct: 'plusMinus'},
  {symbol: '-+', funct: 'plusMinus'},
  {symbol: '->', funct: 'upTo'},
  {symbol: ':', funct: 'upTo'}
]

const splitNumbersAt = (input, symbol) => { return input.split(symbol).map((e) => parseFloat(e.trim())); }

const inputSymbols = (g) => {
  return symbols.filter(e => (g.input.includes(e.symbol)))
}

const relevantSymbol = (g) => {return inputSymbols(g)[0]}

class AbstractFormatter {
  constructor(guesstimate) {
    this.g = guesstimate
  }

  isValid() {
    return (this.errors() && this.errors().length === 0)
  }

  _validNumbers() {
    const numbers = this._numbers(this.g.input)
    return (isNumber(numbers[0]) && isNumber(numbers[1]))
  }

  _numbers() {
    const symbol = relevantSymbol(this.g)
    return splitNumbersAt(this.g.input, symbol.symbol)
  }
}

export class InputPlusMinusFormatter extends AbstractFormatter {
  constructor(g) {
    super(g)
    this.name = 'plusMinus'
  }

  format() {
    const numbers = this._numbers()
    const [mean, range] = numbers
    return {low: (mean - range), high: (mean + range)}
  }

  isA() {
    const g = this.g
    if (!g || !g.input || (inputSymbols(g).length === 0)) { return false }
    return (relevantSymbol(this.g).funct === 'plusMinus')
  }

  errors() {
    if (!this._validNumbers()) { return ['Invalid numbers'] }
    return []
  }
}

export class InputUpToFormatter extends AbstractFormatter {
  constructor(g) {
    super(g)
    this.name = 'Upto'
  }

  format() {
    const numbers = this._numbers()
    return {low: numbers[0], high: numbers[1]}
  }

  isA() {
    const g = this.g
    if (!g || !g.input || (inputSymbols(g).length === 0)) { return false }
    return (relevantSymbol(this.g).funct === 'upTo')
  }

  errors() {
    if (!this._validNumbers()) { return ['Invalid numbers'] }
    return []
  }
}
