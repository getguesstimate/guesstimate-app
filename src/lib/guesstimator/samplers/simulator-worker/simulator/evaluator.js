var Finance = require('financejs')
import math from 'mathjs'

import {Distributions} from './distributions/distributions'
import {ImpureConstructs} from './constructs/constructs'

import * as errorTypes from 'lib/propagation/errors'

const finance = new Finance()
const {
  ERROR_TYPES: {SAMPLING_ERROR, PARSER_ERROR},
  ERROR_SUBTYPES: {
    PARSER_ERROR_SUBTYPES: {FUNCTIONS_CONTAIN_UNITS_ERROR, INCOMPLETE_FUNCTION_ERROR},
    SAMPLING_ERROR_SUBTYPES: {UNEXPECTED_END_OF_EXPRESSION_ERROR, DIVIDE_BY_ZERO_ERROR},
  },
} = errorTypes

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
    if (message.startsWith('Unexpected end of expression')) {
      return {errors: [{type: SAMPLING_ERROR, subType: UNEXPECTED_END_OF_EXPRESSION_ERROR, rawMessage: message}]}
    } else {
      return {errors: [{type: SAMPLING_ERROR, rawMessage: message}]}
    }
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
    const newNum = compiled.eval(sampleInputs(inputs,i))
    const newSample = newNum; // parseFloat(newNum.toFixed(12))

    if (_.isFinite(newSample)) {
      values.push(newSample)
    } else if ([Infinity, -Infinity].includes(newSample)) {
      errors.push({type: SAMPLING_ERROR, subType: DIVIDE_BY_ZERO_ERROR})
      values.push(newSample)
    } else if (newSample.constructor.name === 'Unit') {
      return {values: [], errors: [{type: PARSER_ERROR, subType: FUNCTIONS_CONTAIN_UNITS_ERROR}]}
    } else if (typeof newSample === 'function') {
      return {values: [], errors: [{type: PARSER_ERROR, subType: INCOMPLETE_FUNCTION_ERROR}]}
    } else {
      if (__DEV__) { console.warn('Unidentified sample detected: ', newSample) }
      return {values: [], errors: [{type: SAMPLING_ERROR}]}
    }
  }

  return {values, errors: _.uniq(errors)}
}
