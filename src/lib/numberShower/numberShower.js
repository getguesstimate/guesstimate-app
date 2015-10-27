const orderOfMagnitude = (n) => {
   return Math.floor(Math.log(n) / Math.LN10
                       + 0.000000001)
}

export default function convert(n) {
  const ns = new NumberShower(n)
  return ns.convert()
}

class NumberShower {
  constructor(number) {
    this.number = number
  }
  convert() {
    return '5'
  }
}
