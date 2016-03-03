import Stochator from 'stochator';

export var Sampler = {
  sample(formatted, n) {
    const mean = (formatted.high - formatted.low)/2 + formatted.low

    // This assumes a 90% confidence interval
    const stdev = (formatted.high - mean) / 1.645
    let inputs = {mean, stdev, min: Infinity}

    if (_.isFinite(formatted.minimum)){ inputs.min = formatted.minimum }
    if (_.isFinite(formatted.maximum)){ inputs.max = formatted.maximum }

    if (inputs.mean === 0) {
      inputs.mean = Math.pow(10, -100)
    }

    const stochator = new Stochator(inputs);
    let results = stochator.next(n)
    results = Array.isArray(results) ? results : [results]

    return { values: results.map(n => n) }
  }
}

