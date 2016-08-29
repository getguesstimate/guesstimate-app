import {simulate} from './Simulator.js'

export var Sampler = {
  sample({text}, n, inputs, parentRecordingIndices) {
    return simulate(text, inputs, n, parentRecordingIndices)
  }
}
