import {simulate} from './Simulator.js'

export var Sampler = {
  sample({text}, n, inputs) {
    return simulate(text, inputs, n)
  }
}
