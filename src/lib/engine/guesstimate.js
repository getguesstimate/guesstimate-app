/* @flow */

import type {Guesstimate, Distribution, DGraph, Graph, Simulation} from './types.js'
import {Guesstimator} from '../guesstimator/index.js'

export const attributes = ['metric', 'input', 'guesstimateType', 'description', 'data']

export function sample(guesstimate: Guesstimate, dGraph: DGraph, n: number = 1): Object{
  const [errors, item] = Guesstimator.parse(guesstimate)
  const externalInputs = item.needsExternalInputs() ? _inputMetricsWithValues(guesstimate, dGraph) : []
  const sample = item.sample(n, externalInputs.inputs)
  const precision = item.parsedInput.precision ? item.parsedInput.precision : externalInputs.precision
  const metric = guesstimate.metric
  return { metric, sample, precision }
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
  newGuesstimate.guesstimateType = newGuesstimateType(newGuesstimate)
  return format(newGuesstimate)
}

export function newGuesstimateType(newGuesstimate) {
  const [errors, item] = Guesstimator.parse(newGuesstimate)
  return item.samplerType().referenceName
}

//Check if a function; if not, return []
export function inputMetrics(guesstimate: Guesstimate, dGraph: DGraph): Array<Object> {
  if (!_.has(dGraph, 'metrics')){ return [] }
  return dGraph.metrics.filter( m => (guesstimate.input || '').includes(m.readableId) );
}

export function _inputMetricsWithValues(guesstimate: Guesstimate, dGraph: DGraph): Object{
  const metrics = inputMetrics(guesstimate, dGraph)

  let inputs = {}
  metrics.map(m => { inputs[m.readableId] = _.get(m, 'simulation.sample.values') })

  let precision = Number.POSITIVE_INFINITY
  metrics.map(m => {
    const [errors, item] = Guesstimator.parse(m.guesstimate)
    if (errors.length === 0) {
      precision = Math.min(precision, item.parsedInput.precision)
    }
  })
  precision = (precision === Number.POSITIVE_INFINITY ? 1 : precision)

  return {inputs, precision}
}
