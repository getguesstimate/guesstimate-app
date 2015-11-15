import {withPrecision} from '../filters.js'

export var Sampler = {
  sample(formatted, n) {
    const {low, high} = formatted
    const offset = (high - low)

    let samples = []
    for (let i = 0; i < n; i++) {
      const newSample = (Math.random() * offset) + low
      samples = samples.concat(newSample)
    }

    return { values: samples }
  }
}

