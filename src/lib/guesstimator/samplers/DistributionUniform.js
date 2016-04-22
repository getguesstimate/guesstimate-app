import {simulate} from './Simulator.js'

export var Sampler = {
  sample({low, high}, n) {
    return simulate(`uniform(${low},${high})`, [], n)
  }
}

