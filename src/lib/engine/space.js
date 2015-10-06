import * as _graph from './graph';
import * as _metric from './metric';
import _ from 'lodash';

export function url (space) {
  return ('/space/' + space.id)
}

export function get(collection, id){
  return collection.find(i => (i.id === id))
}

export function subset(oGraph, spaceId){
  let graph = _.cloneDeep(oGraph)

  if (spaceId){
    graph.metrics = graph.metrics.filter(m => m.space === spaceId)
    graph.guesstimates = _.flatten(graph.metrics.map(m => _metric.guesstimates(m, graph)))
  }

  return graph;
}

export function withGraph(space, graph){
  return {...space, graph: subset(graph, space.id)}
}

export function toDgraph(spaceId, graph){
  let _subset = subset(graph, spaceId)
  return _graph.denormalize(_subset)
}
