import * as _graph from './graph';
import * as _metric from './metric';
import _ from 'lodash';

export function url (space) {
  return ('/space/' + space.id)
}

export function get(collection, id){
  return collection.find(i => (i.id === id))
}

export function subset(graph, spaceId){
  if (spaceId){
    const metrics = graph.metrics.filter(m => m.space === spaceId);
    const guesstimates = _.flatten(metrics.map(m => _metric.guesstimates(m, graph)));
    return { metrics, guesstimates }
  } else {
    return graph
  }
}

export function withGraph(space, graph){
  return {...space, graph: subset(graph, space.id)}
}

export function toDgraph(spaceId, graph){
  return _graph.denormalize(subset(graph, spaceId))
}
