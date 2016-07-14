/* @flow */

import type {Guesstimate, Distribution, DGraph, Graph, Simulation} from './types'
import {Guesstimator} from '../guesstimator/index'
import {INPUT_ERROR} from 'lib/errors/modelErrors'

export function equals(l, r) {
  return (
    l.description === r.description &&
    l.guesstimateType === r.guesstimateType &&
    l.input === r.input
  )
}

export const attributes = ['metric', 'input', 'guesstimateType', 'description', 'data']

export function sample(guesstimate: Guesstimate, dGraph: DGraph, n: number = 1) {
  const metric = guesstimate.metric

  let errors = []
  const [parseError, item] = Guesstimator.parse(guesstimate)
  if (!_.isEmpty(parseError)) {errors.push(parseError)}

  const [inputs, inputErrors] = item.needsExternalInputs() ? _inputMetricsWithValues(guesstimate, dGraph) : [{}, []]
  errors.push(...inputErrors)

  if (!_.isEmpty(errors)) {
    return Promise.resolve({ metric, sample: {values: [], errors} })
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
  return dGraph.metrics.filter( m => (guesstimate.input || '').includes(m.readableId) )
}

function _inputMetricsWithValues(guesstimate: Guesstimate, dGraph: DGraph): Object{
  let inputs = {}
  let errors = []
  inputMetrics(guesstimate, dGraph).map(m => {
    inputs[m.readableId] = _.get(m, 'simulation.sample.values')
    const inputErrors = _.get(m, 'simulation.sample.errors') || []
    errors.push(...inputErrors.map(
      ({type, message}) => {
        if (type === INPUT_ERROR) { return {type, message: message.replace('Broken input', 'Broken upstream input')} }
        else { return {type: INPUT_ERROR, message: `Broken input ${m.readableId}`} }
      }
    ))
  })
  return [inputs, _.uniq(errors)]
}
