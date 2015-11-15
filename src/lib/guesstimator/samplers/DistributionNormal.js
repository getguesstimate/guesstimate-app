import Stochator from 'stochator';
import {withPrecision} from '../filters.js'

export var Sampler = {
  sample(formatted, n) {
    const mean = (formatted.high - formatted.low)/2 + formatted.low
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

