import {simulate} from './Simulator.js'

export var Sampler = {
  sample({params: [low, high]}, n) {
    return simulate(`uniform(${low},${high})`, [], n)
  }
}

