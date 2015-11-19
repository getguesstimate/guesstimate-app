/* @flow */

import * as eDistribution from './distribution.js';
import * as functionInput from './functionInput.js';
import * as estimateInput from './estimateInput.js';
import type {Guesstimate, Distribution, DGraph, Graph, Simulation} from './types.js'
import {getStrategy} from './guesstimate-strategies/index.js'
import * as guesstimator from '../guesstimator/index.js'

export function sample(guesstimate: Guesstimate, dGraph: DGraph, n: number = 1): Object{
  let foo = guesstimate;
  foo.text = foo.input
  foo.graph = dGraph
  const formattedInput = guesstimator.format(foo)
  const formatterErrors = guesstimator.errors(foo)

  let _sample = null

  if (formattedInput.guesstimateType === 'NONE') {
    _sample = {errors: ['Invalid input']}
  } else if (formatterErrors.length){
    _sample = {errors: formatterErrors}
  } else {
    _sample = guesstimator.sample(formattedInput, n)
  }

  return {
    metric: guesstimate.metric,
    sample: _sample
  }
}

export function inputMetrics(guesstimate: Guesstimate, dGraph: DGraph): Array<Object> {
  const strategy = getStrategy(guesstimate)
  return strategy.inputMetrics(guesstimate, dGraph)
}

export function toEditorState(guesstimate: Guesstimate): string{
  return (getStrategy(guesstimate).name === 'function') ? 'function': 'estimate'
}

export function simulations(guesstimate: Guesstimate, graph:Graph) : Array<Simulation>{
  return graph.simulations && graph.simulations.filter(s => (s.metric === guesstimate.metric))
}
