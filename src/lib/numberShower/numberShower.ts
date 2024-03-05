export function numberShow(n: number, p = 2) {
  const ns = new NumberShower(n, p);
  return ns.convert();
}

// 105 -> 3
const orderOfMagnitudeNum = (n: number) => {
  return Math.pow(10, n);
};

function largeNumberSigFigs(n: number, sig) {
  const mult = Math.pow(10, sig - Math.floor(Math.log(n) / Math.LN10) - 1);
  return Math.round(n * mult) / mult;
}

// 105 -> 3
const orderOfMagnitude = (n: number) => {
  return Math.floor(Math.log(n) / Math.LN10 + 0.000000001);
};

function withXSigFigs(number: number, sigFigs: number) {
  const withPrecision = number.toPrecision(sigFigs);
  const formatted = Number(withPrecision);
  return `${formatted}`;
}

class NumberShower {
  number: number;
  precision: number;

  constructor(number: number, precision = 2) {
    this.number = number;
    this.precision = precision;
  }

  convert() {
    const number = Math.abs(this.number);
    const response = this.evaluate(number);
    if (this.number < 0) {
      response.value = "-" + response.value;
    }
    return response;
  }

  metricSystem(number: number, order: number) {
    const newNumber = number / orderOfMagnitudeNum(order);
    const precision = this.precision;
    return `${withXSigFigs(newNumber, precision)}`;
  }

  evaluate(number: number) {
    if (number === 0) {
      return { value: this.metricSystem(0, 0) };
    }

    const order = orderOfMagnitude(number);
    if (order < -2) {
      return { value: this.metricSystem(number, order), power: order };
    } else if (order < 4) {
      return { value: this.metricSystem(number, 0) };
    } else if (order < 6) {
      return { value: this.metricSystem(number, 3), symbol: "K" };
    } else if (order < 9) {
      return { value: this.metricSystem(number, 6), symbol: "M" };
    } else if (order < 12) {
      return { value: this.metricSystem(number, 9), symbol: "B" };
    } else if (order < 15) {
      return { value: this.metricSystem(number, 12), symbol: "T" };
    } else {
      return { value: this.metricSystem(number, order), power: order };
    }
  }
}
