/* @flow */

import type {Guesstimate, Distribution, DGraph, Graph, Simulation} from './types.js'
import {Guesstimator} from '../guesstimator/index.js'

export const attributes = ['metric', 'input', 'guesstimateType', 'description', 'data']

export function sample(guesstimate: Guesstimate, dGraph: DGraph, n: number = 1): Object{
  const [errors, item] = Guesstimator.parse(guesstimate)
  const externalInputs = item.needsExternalInputs() ? _inputMetricsWithValues(guesstimate, dGraph) : []
  const sample = item.sample(n, externalInputs)
  const metric = guesstimate.metric
  return { metric, sample }
}

export function format(guesstimate: Guesstimate): Guesstimate{
  let formatted = _.pick(guesstimate, attributes)
  return formatted
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
  const [errors, item] = Guesstimator.parse({text: newGuesstimate.input})
  let guessType = item.samplerType()

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

//Check if a function; if not, return []
export function inputMetrics(guesstimate: Guesstimate, dGraph: DGraph): Array<Object> {
  if (!_.has(dGraph, 'metrics')){ return [] }
  return dGraph.metrics.filter( m => guesstimate.input.includes(m.readableId) );
}

export function _inputMetricsWithValues(guesstimate: Guesstimate, dGraph: DGraph): Object{
  let inputs = {}
  inputMetrics(guesstimate, dGraph)
    .map(m => {inputs[m.readableId] = _.get(m, 'simulation.sample.values') })
  return inputs
}
