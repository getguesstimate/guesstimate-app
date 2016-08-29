import {simulate} from './Simulator.js'

export var Sampler = {
  sample({params: [low, high]}, n, _1, parentRecordingIndices) {
    return simulate(`uniform(${low},${high})`, [], n, parentRecordingIndices)
  }
}

