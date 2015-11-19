import Stochator from 'stochator';
import {withPrecision} from '../filters.js'

export var Sampler = {
  sample(formatted, n) {
    const mean = (formatted.high - formatted.low)/2 + formatted.low
    const stdev = formatted.high - mean
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

