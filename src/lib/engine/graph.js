import * as _metric from './metric'
import * as _dgraph from './dgraph'
import * as _space from './space'
import * as _collections from './collections'

import BasicGraph from 'lib/basic_graph/basic-graph'
import {INFINITE_LOOP_ERROR} from 'lib/errors/modelErrors'

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

export const denormalize = graph => ({metrics: graph.metrics.map(_metric.denormalizeFn(graph)).filter(_collections.isPresent)})
export const runSimulation = (graph, metricId, n) => _dgraph.runSimulation(denormalize(graph), metricId, n)

function basicGraph(graph) {
  const dGraph = denormalize(graph)
  const edges = _dgraph.dependencyMap(dGraph)
  return new BasicGraph(_.map(graph.metrics, m => m.id), edges)
}
