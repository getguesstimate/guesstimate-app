import Stochator from 'stochator';
import {withPrecision} from '../filters.js'

export var Sampler = {
  sample(formatted, n) {
    const mean = (formatted.high - formatted.low)/2 + formatted.low
    const stdev = formatted.high - mean
    let inputs = {mean, stdev, seed: 'SEED'}

    if (_.isFinite(formatted.minimum)){ inputs.min = formatted.minimum }
    if (_.isFinite(formatted.maximum)){ inputs.max = formatted.maximum }

    const stochator = new Stochator(inputs);
    let results = stochator.next(n)
    results = Array.isArray(results) ? results : [results]

    return { values: results.map(n => n) }
  }
}

