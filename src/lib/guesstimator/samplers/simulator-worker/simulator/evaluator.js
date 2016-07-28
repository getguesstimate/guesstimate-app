var _ = require('lodash')
import math from 'mathjs'
import {Distributions} from './distributions/distributions.js'
import {ImpureConstructs} from './constructs/constructs.js'
var Finance = require('financejs')
const finance = new Finance()

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

// Distributions:
math.import(Distributions, {override: true})
// Financial functions:
math.import(financeFunctions, {override: true})
// Guesstimate constructs:
math.import(ImpureConstructs, {override: true, wrap: true})

// All of jStat's functions are impure as they require sampling on pure inputs.
export const STOCHASTIC_FUNCTIONS = ['pickRandom', 'randomInt', 'random'].concat(Object.keys(Distributions)).concat(Object.keys(ImpureConstructs))

export function Evaluate(text, sampleCount, inputs) {
  try {
    const compiled = math.compile(text)
    return evaluate(compiled, inputs, sampleCount)
  } catch (exception) {
    let error = exception.message[0].toLowerCase() + exception.message.slice(1)
    return {errors: [error]}
  }
}

function sampleInputs(inputs, i) {
  const sample = {}
  for (let key of Object.keys(inputs)){
    sample[key] = inputs[key][i % inputs[key].length]
  }
  return sample
}

function evaluate(compiled, inputs, n){
  let values = []
  for (let i = 0; i < n; i++) {
    const sampledInputs = sampleInputs(inputs,i)
    const newSample = compiled.eval(sampledInputs)

    if (_.isFinite(newSample)) {
      values = values.concat(newSample)
    } else {
      debugger
      return {values, errors: ['invalid sample']}
    }
  }

  return {values}
}
