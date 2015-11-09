import Stochator from 'stochator';

export var Sampler = {
  sample(formatted, n) {
    const mean = (formatted.high - formatted.low)/2
    const stdev = formatted.high - mean
    const stochator = new Stochator({
      mean,
      stdev,
      seed: 0,
      min: -99999999999999
    });
    let results = stochator.next(n)
    results = Array.isArray(results) ? results : [results]
    return { values: results.map(n => n) }
  }
}

