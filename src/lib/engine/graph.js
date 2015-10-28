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
// replaces its guesstimte
export function toBizarroGraph(graph, guesstimateForm){
  let bGraph = _.cloneDeep(graph)
  bGraph.guesstimates = graph.guesstimates.filter((g) => (g.metric !== guesstimateForm.metric))
  bGraph.guesstimates = bGraph.guesstimates.concat(guesstimateForm)
  return bGraph
}

export function runSimulation(graph, metricId, n){
  return _dgraph.runSimulation(denormalize(graph), metricId, n);
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
  const {spaceId, metricId} = graphFilters

  let graph = oGraph
  if (spaceId) { graph = _space.subset(oGraph, spaceId) }

  let bGraph = basicGraph(graph)
  if (metricId) { bGraph = bGraph.subsetFrom(metricId) }

  return bGraph.nodes.map(n => [n.id, n.maxDistanceFromRoot])
}
