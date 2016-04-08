import math from 'mathjs'
import {jStat} from 'jstat'
var Finance = require('financejs')
const finance = new Finance()

const jStatDistributions = {
  beta: jStat.beta.sample,
  centralF: jStat.centralF.sample,
  cauchy: jStat.cauchy.sample,
  chisquare: jStat.chisquare.sample,
  exponential: jStat.exponential.sample,
  invgamma: jStat.invgamma.sample,
  lognormal: jStat.lognormal.sample,
  normal: jStat.normal.sample,
  studentt: jStat.studentt.sample,
  weibull: jStat.weibull.sample,
  uniform: jStat.uniform.sample,
  gamma: jStat.gamma.sample
}

const financeFunctions = {
  PV: finance.PV,
  FV: finance.FV,
  NPV: finance.NPV,
  //IRR: finance.IRR, Too slow.
  PP: finance.PP,
  ROI: finance.ROI,
  AM: finance.AM,
  PI: finance.PI,
  DF: finance.DF,
  CI: finance.CI,
  CAGR: finance.CAGR,
  LR: finance.LR,
  R72: finance.R72,
  WACC: finance.WACC
}

// Here, we extend the math.js parser and library with the jStat sample functions. We override any default math.js
// functions because we want the jStat distributions to have priority.
math.import(jStatDistributions, {override: true})
// Here, we extend the math.js parser with financial functions.
math.import(financeFunctions, {override: true})

// All of jStat's functions are impure as they require sampling on pure inputs.
const IMPURE_FUNCTIONS = ['pickRandom', 'randomInt', 'random'].concat(Object.keys(jStatDistributions))

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

export function sampleInputs(inputs, i) {
  const sample = {}
  for (let key of Object.keys(inputs)){
    let item = null
    sample[key] = inputs[key][i % inputs[key].length]
  }
  return sample
}

export function sample(compiled, inputs, n){
  let samples = []
  for (let i = 0; i < n; i++) {
    const sampledInputs = sampleInputs(inputs, i)
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
