import * as _graph from './graph';

export function url (space) {
  return ('/space/' + space.id)
}

export function subset(oGraph, spaceId){
  let graph = _.cloneDeep(oGraph)

  if (spaceId){
    graph.metrics = graph.metrics.filter(m => m.space === spaceId)
    graph.guesstimates = graph.guesstimates.filter(m => !_.isUndefined(metric(graph, m.id)))
  }

  return graph;
}

export function metric(graph, id){
  return graph.metrics.find(m => (m.id === id));
}
