/* @flow */

import * as eDistribution from './distribution.js';
import * as functionInput from './functionInput.js';
import * as estimateInput from './estimateInput.js';
import type {Guesstimate, Distribution, DGraph, Graph, Simulation} from './types.js'
import * as guesstimator from '../guesstimator/index.js'

export const attributes = ['metric', 'input', 'guesstimateType', 'description', 'value']

export function sample(guesstimate: Guesstimate, dGraph: DGraph, n: number = 1): Object{
  return guesstimator.sampleFromGuesstimateApp(guesstimate, dGraph, n)
}

export function format(guesstimate: Guesstimate): Guesstimate{
  let formatted = _.pick(guesstimate, attributes)
  return formatted
}

export function inputMetrics(guesstimate: Guesstimate, dGraph: DGraph): Array<Object> {
  return guesstimator.inputMetrics(guesstimate, dGraph)
}

export function simulations(guesstimate: Guesstimate, graph:Graph) : Array<Simulation>{
  return graph.simulations && graph.simulations.filter(s => (s.metric === guesstimate.metric))
}

export function update(oldGuesstimate, newParams) {
  let newGuesstimate = Object.assign({}, oldGuesstimate, newParams)
  newGuesstimate.guesstimateType = newGuesstimateType(oldGuesstimate, newGuesstimate)
  return format(newGuesstimate)
}

export function newGuesstimateType(oldGuesstimate, newGuesstimate) {
  let guessType = guesstimator.find(guesstimator.format({text: newGuesstimate.input}).guesstimateType)
  const isInferrable = !guessType.isRangeDistribution
  const {guesstimateType} = newGuesstimate
  if (isInferrable) {
    return guessType.referenceName
  } else if (guesstimateType === 'NONE') {
    return 'NORMAL'
  } else {
    return (guesstimateType || 'NORMAL')
  }
}
