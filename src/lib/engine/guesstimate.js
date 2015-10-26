/* @flow */

import * as eDistribution from './distribution.js';
import * as functionInput from './functionInput.js';
import * as estimateInput from './estimateInput.js';
import type {Guesstimate, Distribution, DGraph, Graph, Simulation} from './types.js'

function toDistribution(guesstimate: Guesstimate): Distribution {
  let input = guesstimate.input;
  if (isFunc(input)){
    return functionInput.toDistribution(input)
  } else {
    return estimateInput.toDistribution(input)
  }
}

function isFunc(input: string): boolean {
  return (input[0] === '=');
}

export function inputMetrics(guesstimate: Guesstimate, dGraph: DGraph): Array<Object> {
  if (!isFunc(guesstimate.input)){
    return []
  } else {
    let result = functionInput.inputMetrics(guesstimate.input, dGraph)
    return result || []
  }
}

//This obviously could use some clean up.  Maybe, each sample includes the metric info.
export function sample(guesstimate: Guesstimate, dGraph: DGraph, n: number = 1): Object{
  let distribution = toDistribution(guesstimate)
  let _sample = eDistribution.sample(distribution, dGraph, n)
  return {
    metric: guesstimate.metric,
    sample: _sample
  };
}

export function toEditorState(guesstimate: Guesstimate): string{
  if (isFunc(guesstimate.input)){
    return 'function';
  } else {
    return 'estimate';
  }
}

export function simulations(guesstimate: Guesstimate, graph:Graph) : Array<Simulation>{
  return graph.simulations && graph.simulations.filter(s => (s.metric === guesstimate.metric))
}
