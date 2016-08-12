import * as graph from './graph'
import * as _guesstimate from './guesstimate'
import * as _facts from './facts'
import * as _collections from './collections'

import {INTERNAL_ERROR, MATH_ERROR} from 'lib/errors/modelErrors'

export function runSimulation(dGraph, metricId, n) {
  const m = _collections.get(dGraph.metrics, metricId)
  if (!m) {
    console.warn('Unknown metric referenced')
    return Promise.resolve({sample: {errors: [{type: INTERNAL_ERROR, message: 'Unknown metric referenced'}]}})
  } else if (_facts.HANDLE_REGEX.test(m.guesstimate.input)) {
    const unresolvedFacts = m.guesstimate.input.match(_facts.HANDLE_REGEX)
    const message = `Unknown fact${unresolvedFacts.length > 1 ? 's' : ''} referenced: ${unresolvedFacts.join(', ')}`
    return Promise.resolve({sample: {errors: [{type: MATH_ERROR, message}]}})
  }
  return _guesstimate.sample(m.guesstimate, dGraph, n)
}

const toEdges = dGraph => ({id, guesstimate}) => _guesstimate.inputMetrics(guesstimate, dGraph).map(i => ({output: id, input: i.id}))
export const dependencyMap = dGraph => _.isEmpty(dGraph) ? [] : _.flatten(dGraph.metrics.map(toEdges(dGraph)))
