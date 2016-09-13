import * as _metric from './metric'
import {isPresent} from './utils'

export const INTERMEDIATE = 'INTERMEDIATE'
export const OUTPUT = 'OUTPUT'
export const INPUT = 'INPUT'
export const NOEDGE = 'NOEDGE'

export function relationshipType(edges) {
  if (!_.isEmpty(edges.inputs) && !_.isEmpty(edges.outputs)) { return INTERMEDIATE }
  if (!_.isEmpty(edges.inputs)) { return OUTPUT }
  if (!_.isEmpty(edges.outputs)) { return INPUT }
  return NOEDGE
}

export const denormalize = graph => ({metrics: graph.metrics.map(_metric.denormalizeFn(graph)).filter(isPresent)})
