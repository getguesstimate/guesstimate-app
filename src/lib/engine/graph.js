import * as _metric from './metric'
import * as _dgraph from './dgraph'
import * as _space from './space'
import BasicGraph from '../basic_graph/basic-graph'

export function create(graphAttributes) {
  return _.pick(graphAttributes, ['metrics', 'guesstimates', 'simulations'])
}

export function denormalize(graph) {
  const metrics = _.map(graph.metrics, m => _metric.denormalize(m, graph))
  return {metrics}
}

export function runSimulation(graph, metricId, n) {
  return _dgraph.runSimulation(denormalize(graph), metricId, n)
}

export function metric(graph, id) {
  return graph.metrics.find(m => (m.id === id))
}

function basicGraph(graph) {
  const dGraph = denormalize(graph)
  const edges = _dgraph.dependencyMap(dGraph)
  return new BasicGraph(_.map(graph.metrics, m => m.id), edges)
}

export function dependencyList(graph, spaceId) {
  const graphSubset = _space.subset(graph, spaceId)
  const bGraph = basicGraph(graphSubset)
  return bGraph.nodes.map(n => [n.id, n.maxDistanceFromRoot])
}

// This could be optimized for filtering the graph by the space subset
export function dependencyTree(oGraph, graphFilters) {
  const {spaceId, metricId, onlyHead, notHead, onlyUnsimulated} = graphFilters

  if (onlyHead) { return [[metricId, 0]] }

  let graph = oGraph
  if (spaceId) { graph = _space.subset(oGraph, spaceId) }

  let bGraph = basicGraph(graph)
  if (metricId) {
    bGraph = bGraph.subsetFrom([metricId]) 
  } else if (onlyUnsimulated) {
    const {metrics, simulations} = oGraph
    const unsimulatedIds = metrics.
      filter(m => !_.some(simulations, s => s.metric === m.id)).
      map(m => m.id)

    bGraph = bGraph.subsetFrom(unsimulatedIds)
  }

  const nodes = bGraph.nodes.map(n => [n.id, n.maxDistanceFromRoot])

  if (notHead) {
    const head = nodes.find(e => (e[0] === metricId))
    const rest = nodes.filter(e => (e[0] !== metricId))
    if (!_.isFinite(head[1])) {
      return [head,...rest]
    }
    return rest
  } else {
    return nodes
  }
}
