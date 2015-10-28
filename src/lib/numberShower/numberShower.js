export default function numberShow(n) {
  const ns = new NumberShower(n)
  return ns.convert()
}

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

  metricSystem(number, order) {
    const newNumber = number / orderOfMagnitudeNum(order)
    return `${withXSigFigs(newNumber, 2)}`
  }

  foo() {
    const order = orderOfMagnitude(this.number)
    const number = this.number

    if (order < 3) {
      return {value: this.metricSystem(number, 0)}
    } else if (order < 6) {
      return {value: this.metricSystem(number, 3), symbol: 'K'}
    } else if (order < 9) {
      return {value: this.metricSystem(number, 6), symbol: 'M'}
    } else if (order < 12) {
      return {value: this.metricSystem(number, 9), symbol: 'G'}
    } else if (order < 15) {
      return {value: this.metricSystem(number, 12), symbol: 'T'}
    } else {
      return {value: this.metricSystem(number, order), power: order}
    }
  }
}
