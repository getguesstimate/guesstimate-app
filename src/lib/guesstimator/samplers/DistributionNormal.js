import math from 'mathjs';
import {Sample} from './Sampler.js'
import {jStat} from 'jstat'

export var Sampler = {
  sample({high, low}, n) {
    // This assumes a 90% confidence interval, distributed symmetrically.
    const mean = math.mean(high, low)
    const stdev = (high - mean) / 1.645
    return { values: Sample(n, () => jStat.normal.sample(mean, stdev)) }
  }
}

