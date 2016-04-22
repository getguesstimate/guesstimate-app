import {simulate} from 'servers/simulation-cloud/simulation-cloud.js'

export var Sampler = {
  sample({low, high}, n) {
    return simulate(`uniform(${low},${high})`, [], n)
  }
}

