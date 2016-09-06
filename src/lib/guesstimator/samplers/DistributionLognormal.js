import math from 'mathjs'
import {simulate} from './Simulator.js'

export var Sampler = {
  sample({params: [low, high]}, n, _1) {
    // This assumes a centered 90% confidence interval, e.g. the left endpoint
    // marks 0.05% on the CDF, the right 0.95%.
    const logHigh = math.log(high)
    const logLow = math.log(low)

    const mean = math.mean(logHigh, logLow)
    const stdev = (logHigh-logLow) / (2*1.645)

    return simulate(`lognormal(${mean},${stdev})`, [], n)
  }
}
