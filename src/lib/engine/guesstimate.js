/* @flow */

import * as eDistribution from './distribution.js';
import * as functionInput from './functionInput.js';
import * as estimateInput from './estimateInput.js';
import type {Guesstimate, Distribution, DGraph, Graph, Simulation} from './types.js'
import {getStrategy} from './guesstimate-strategies/index.js'

export function sample(guesstimate: Guesstimate, dGraph: DGraph, n: number = 1): Object{
  const strategy = getStrategy(guesstimate)
  const _sample = strategy.sample(guesstimate, n, dGraph)
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
