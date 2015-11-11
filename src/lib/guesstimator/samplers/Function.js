import math from 'mathjs';

export var Sampler = {
  sample({text, inputs}, n) {
    const compiled = math.compile(text)
    return sample(compiled, inputs, n)
  }
}

export function sampleInputs(inputs) {
  const sample = {}
  for (let key of Object.keys(inputs)){
    sample[key] = _.sample(inputs[key])
  }
  return sample
}

export function sample(compiled, inputs, n){
  let samples = []
  for (let i = 0; i < n; i++) {
    const sampledInputs = sampleInputs(inputs)
    const newSample = compiled.eval(sampledInputs)

    if (_.isFinite(newSample)) {
      samples = samples.concat(newSample)
    } else {
      return {values: samples, errors: ['Invalid sample']}
    }
  }

  return {values: samples}
}
