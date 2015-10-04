import * as _graph from './graph';
import * as _metric from './metric'

export function url (space) {
  return ('/space/' + space.id)
}

export function subset(oGraph, spaceId){
  let graph = _.cloneDeep(oGraph)

  if (spaceId){
    graph.metrics = graph.metrics.filter(m => m.space === spaceId)
    graph.guesstimates = _.flatten(graph.metrics.map(m => _metric.guesstimates(m, graph)))
  }

  return graph;
}

