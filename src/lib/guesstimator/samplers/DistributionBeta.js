import math from 'mathjs';
import {Sample} from './Sampler.js'
import {jStat} from 'jstat'

export var Sampler = {
  sample({hits, total}, n) {
    // This treats your entry as a prior.
    return { values: Sample(n, () => jStat.beta.sample(hits, total-hits)) }
  }
}

