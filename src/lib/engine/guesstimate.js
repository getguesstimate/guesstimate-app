/* @flow */

import * as eDistribution from './distribution.js';
import * as functionInput from './functionInput.js';
import * as estimateInput from './estimateInput.js';
import type {Guesstimate, Distribution, DGraph, Graph, Simulation} from './types.js'
import * as guesstimator from '../guesstimator/index.js'

export const attributes = ['metric', 'input', 'guesstimateType', 'reasoning']

export function sample(guesstimate: Guesstimate, dGraph: DGraph, n: number = 1): Object{
  return guesstimator.sampleFromGuesstimateApp(guesstimate, dGraph, n)
}

export function format(guesstimate: Guesstimate): Guesstimate{
  let formatted = _.pick(guesstimate, attributes)
  return _.pick(guesstimate, attributes)
}

export function inputMetrics(guesstimate: Guesstimate, dGraph: DGraph): Array<Object> {
  return guesstimator.inputMetrics(guesstimate, dGraph)
}

export function simulations(guesstimate: Guesstimate, graph:Graph) : Array<Simulation>{
  return graph.simulations && graph.simulations.filter(s => (s.metric === guesstimate.metric))
}
