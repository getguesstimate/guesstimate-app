import math from 'mathjs';
var jStat = require('jstat').jStat;

math.import({
  beta: (a,b,c) => {return jStat.beta.sample(a,b,c)},
  centralF: (a,b,c) => {return jStat.centralF.sample(a,b,c)},
  cauchy: (a,b,c) => {return jStat.cauchy.sample(a,b,c)},
  chisquare: (a,b) => {return jStat.chisquare.sample(a,b)},
  exponential: (a) => {return jStat.exponential.sample(a)},
  invgamma: (a,b) => {return jStat.invgamma.sample(a,b)},
  kumaraswamy: (a,b) => {return jStat.kumaraswamy.sample(a,b)},
  lognormal: (a,b) => {return jStat.lognormal.sample(a,b)},
  normal: (a,b) => {return jStat.normal.sample(a,b)},
  studentt: (a) => {return jStat.studentt.sample(a)},
  weibull: (a,b) => {return jStat.weibull.sample(a,b)},
  uniform: (a,b) => {return jStat.uniform.sample(a,b)}
  //gamma: jStat.gamma.sample
})

const IMPURE_FUNCTIONS = [
  'pickRandom',
  'randomInt',
  'random',
  'beta',
  'centralF',
  'cauchy',
  'chisquare',
  'exponential',
  'invgamma',
  'kumaraswamy',
  'lognormal',
  'studentt',
  'weibull',
  'uniform'
]

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
