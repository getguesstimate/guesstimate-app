import {Sample} from './Sampler.js'
import {jStat} from 'jstat'

export var Sampler = {
  sample({low, high}, n) {
    return { values: Sample(n, () => jStat.uniform.sample(low, high)) }
  }
}

