/* @flow */

import type {Guesstimate, Distribution, DGraph, Graph, Simulation} from './types.js'
import {Guesstimator} from '../guesstimator/index.js'

export const attributes = ['metric', 'input', 'guesstimateType', 'description', 'data']

export function sample(guesstimate: Guesstimate, dGraph: DGraph, n: number = 1) {
  const metric = guesstimate.metric

  const [parseErrors, item] = Guesstimator.parse(guesstimate)
  if (parseErrors.length > 0) {
    return Promise.resolve({ metric, sample: {values: [], errors: parseErrors} })
  }

  const externalInputs = item.needsExternalInputs() ? _inputMetricsWithValues(guesstimate, dGraph) : []

  let inputErrors = []
  let inputs = {}
  for (let input of Object.keys(externalInputs)) {
    if (externalInputs[input].errors && externalInputs[input].errors.length > 0) {
      const upstreamErrors = externalInputs[input].errors.map(e => {
        if (e === 'BROKEN_INPUT' || e === 'BROKEN_UPSTREAM') {
          return 'BROKEN_UPSTREAM'
        } else {
          return 'BROKEN_INPUT'
        }
      })
      inputErrors.push(...upstreamErrors)
    }
    inputs[input] = externalInputs[input].values
  }
  inputErrors = _.uniq(inputErrors)
  if (inputErrors.length > 0) {
    return Promise.resolve({ metric, sample: {values: [], errors: inputErrors} })
  }

  return item.sample(n, inputs).then(sample => ({ metric, sample }))
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

function _inputMetricsWithValues(guesstimate: Guesstimate, dGraph: DGraph): Object{
  let inputs = {}
  inputMetrics(guesstimate, dGraph)
  .map(m => {inputs[m.readableId] = {
    values: _.get(m, 'simulation.sample.values'),
    errors: _.get(m, 'simulation.sample.errors'),
  }})
  return inputs
}
