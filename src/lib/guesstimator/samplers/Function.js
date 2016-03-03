import math from 'mathjs';
const IMPURE_FUNCTIONS = ['pickRandom', 'randomInt', 'random']

export var Sampler = {
  sample({text}, n, inputs) {
    try {
      const compiled = math.compile(text)
      const sampleCount = requiredSampleCount(text, inputs, n)
      return sample(compiled, inputs, sampleCount)
    } catch (exception) {
      return [{errors: [exception.message]}];
    }
  }
}

const requiredSampleCount = (text, inputs, n) => (isPure(text, inputs) ? 1 : n)

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

export function isPure(text, inputs) {
  const impureInputs = _.some(inputs, (i) => someDifferent(i))
  const impureFunction = hasImpureFunction(text)
  return (!impureInputs) && (!impureFunction)
}

const hasImpureFunction = (text) => _.some(IMPURE_FUNCTIONS, e => text.indexOf(e) !== -1)

function someDifferent(array) {
  const firstElement = array[0]
  return _.some(array, e => (e !== firstElement))
}
