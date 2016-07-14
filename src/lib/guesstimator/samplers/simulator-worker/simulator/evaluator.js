var _ = require('lodash')
import math from 'mathjs'
import {Distributions} from './distributions/distributions'
import {ImpureConstructs} from './constructs/constructs'
import {MATH_ERROR, PARSER_ERROR} from 'lib/errors/modelErrors'
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
  } catch ({message}) {
    return {errors: [{type: MATH_ERROR, message}]}
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
  let errors = []
  for (let i = 0; i < n; i++) {
    const newSample = compiled.eval(sampleInputs(inputs,i))

    if (_.isFinite(newSample)) {
      values.push(newSample)
    } else if ([Infinity, -Infinity].includes(newSample)) {
      errors.push({type: MATH_ERROR, message: 'Divide by zero error'})
      values.push(newSample)
    } else if (newSample.constructor.name === 'Unit') {
      return {values: [], errors: [{type: PARSER_ERROR, message: "Functions can't contain units or suffixes"}]}
    } else if (typeof newSample === 'function') {
      return {values: [], errors: [{type: PARSER_ERROR, message: "Incomplete function in input"}]}
    } else {
      if (__DEV__) { console.warn('Unidentified sample detected: ', newSample) }
      return {values: [], errors: [{type: MATH_ERROR, message: 'Sampling error detected'}]}
    }
  }

  return {values, errors: _.uniq(errors)}
}
