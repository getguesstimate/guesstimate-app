import {simulate} from 'servers/simulation-cloud/simulation-cloud.js'

export var Sampler = {
  sample({text}, n, inputs) {
    return simulate(text, inputs, n)
  }
}
