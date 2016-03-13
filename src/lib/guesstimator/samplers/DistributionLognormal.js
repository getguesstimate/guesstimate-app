import math from 'mathjs';
import {Sample} from './Sampler.js'
import {jStat} from 'jstat'

export var Sampler = {
  sample({high, low}, n) {
    // This assumes a centered 90% confidence interval, e.g. the left endpoint
    // marks 0.05% on the CDF, the right 0.95%.
    const logHigh = math.log(high)
    const logLow = math.log(low)

    const mean = math.mean(logHigh, logLow)
    const stdev = (logHigh-logLow) / (2*1.645)
    return { values: Sample(n, () => jStat.lognormal.sample(mean, stdev)) }
  }
}

