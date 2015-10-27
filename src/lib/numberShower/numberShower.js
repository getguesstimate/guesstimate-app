// 105 -> 3
const orderOfMagnitudeNum = (n) => {
  return Math.pow(10, n)
}

function largeNumberSigFigs(n, sig) {
  var mult = Math.pow(10,
      sig - Math.floor(Math.log(n) / Math.LN10) - 1);
  return Math.round(n * mult) / mult;
}

// 105 -> 3
const orderOfMagnitude = (n) => {
  return Math.floor(Math.log(n) / Math.LN10 + 0.000000001)
}

export default function convert(n) {
  const ns = new NumberShower(n)
  return ns.convert()
}

function withXSigFigs(number, sigFigs){
  const withPrecision = number.toPrecision(sigFigs)
  const formatted = (number >= 10) ? Number(withPrecision) : withPrecision
  return `${formatted}`
}

class NumberShower {
  constructor(number) {
    this.number = number
  }

  convert() {
    const firstNum = this.foo()
    return firstNum
  }

  metricSystem(number, order, variable='') {
    const newNumber = number / orderOfMagnitudeNum(order)
    return `${withXSigFigs(newNumber, 2)}${variable}`
  }

  foo() {
    const order = orderOfMagnitude(this.number)
    const number = this.number

    if (order < 3) {
      return this.metricSystem(number, 0)
    } else if (order < 6) {
      return this.metricSystem(number, 3, 'K')
    } else if (order < 9) {
      return this.metricSystem(number, 6, 'M')
    } else if (order < 12) {
      return this.metricSystem(number, 9, 'G')
    } else if (order < 15) {
      return this.metricSystem(number, 12, 'T')
    } else {
      return this.metricSystem(number, order, `x10^${order}`)
    }
  }
}
