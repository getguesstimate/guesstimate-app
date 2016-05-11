import * as _metric from './metric';
import * as _dgraph from './dgraph';
import * as _space from './space';
import BasicGraph from '../basic_graph/basic-graph.js'

export function create(graphAttributes){
  return _.pick(graphAttributes, ['metrics', 'guesstimates', 'simulations']);
}

export function denormalize(graph){
  let metrics = graph.metrics.map(m => _metric.denormalize(m, graph));
  return {metrics};
}

// The bizarro graph is the version of the graph where a guesstimates input is
// replaces its guesstimte.
// BEWARE: This function modifies its inputs.
export function toBizarroGraph(graph, guesstimateForm){
  if (!_.has(guesstimateForm, 'metric')) { return graph }
  let bGraph = graph
  bGraph.guesstimates = graph.guesstimates && graph.guesstimates.filter((g) => (g.metric !== guesstimateForm.metric))
  bGraph.guesstimates = bGraph.guesstimates && bGraph.guesstimates.concat(guesstimateForm)
  return bGraph
}

export function runSimulation(graph, metricId, n) {
  return _dgraph.runSimulation(denormalize(graph), metricId, n)
}

export function metric(graph, id){
  return graph.metrics.find(m => (m.id === id));
}

function basicGraph(graph){
  const dGraph = denormalize(graph)
  const edges = _dgraph.dependencyMap(dGraph)
  return new BasicGraph(graph.metrics.map(m => m.id), edges)
}

export function dependencyList(graph, spaceId) {
  const graphSubset = _space.subset(graph, spaceId)
  const bGraph = basicGraph(graphSubset)
  return bGraph.nodes.map(n => [n.id, n.maxDistanceFromRoot])
}

// This could be optimized for filtering the graph by the space subset
export function dependencyTree(oGraph, graphFilters) {
  const {spaceId, metricId, onlyHead, notHead} = graphFilters

  if (onlyHead) { return [[metricId, 0]] }

  let graph = oGraph
  if (spaceId) { graph = _space.subset(oGraph, spaceId) }

  let bGraph = basicGraph(graph)
  if (metricId) { bGraph = bGraph.subsetFrom(metricId) }

  const nodes = bGraph.nodes.map(n => [n.id, n.maxDistanceFromRoot])

  if (notHead){
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
