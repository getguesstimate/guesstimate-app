var jStat = require('jstat').jStat
import {Sample} from './Sampler.js'

export var Sampler = {
  sample({low, high}, n) {
    return { values: Sample(n, jStat.uniform.sample, [low, high]) }
  }
}

