import math from 'mathjs';
import {Sample} from './Sampler.js'
import {jStat} from 'jstat'

export var Sampler = {
  sample({hits, total}, n) {
    // This assumes a uniform prior on likelihood.
    return { values: Sample(n, () => jStat.beta.sample(hits+1, total-hits+1)) }
  }
}

