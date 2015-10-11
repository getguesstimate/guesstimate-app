import * as _graph from './graph';
import * as _metric from './metric';
import * as _guesstimate from './guesstimate';
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
    const simulations = _.flatten(guesstimates.map(g => _guesstimate.simulations(g, graph)));
    return { metrics, guesstimates, simulations }
  } else {
    return graph
  }
}

export function withGraph(space, graph){
  return {...space, graph: subset(graph, space.id)}
}

function user(space, graph){
  return graph.users.find(e => (e.id === space.user_id) )
}

export function toDgraph(spaceId, graph){
  let dGraph = _graph.denormalize(subset(graph, spaceId))
  const space = get(graph.spaces, spaceId)
  dGraph.user = user(space, graph)
  return dGraph
}
