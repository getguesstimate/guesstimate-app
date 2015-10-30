import uuid from 'node-uuid';
import generateRandomReadableId from './metric/generate_random_readable_id.js'

export function create(metricNames) {
  return {
    id: uuid.v1(),
    readableId: generateRandomReadableId(metricNames)
  }
}

export function get(collection, id){
  return collection.find(i => (i.id === id))
}

function findWithId(collection, id, property) {
  if (collection && id && property) {
    return collection.find(e => e[property] === id);
  } else {
    return null;
  }
}

export function denormalize(metric, graph) {
  let findWithMetricId = (g) => findWithId(g, metric.id, 'metric');
  let guesstimate = findWithMetricId(graph.guesstimates);
  let simulation = findWithMetricId(graph.simulations);
  return Object.assign({}, metric, {guesstimate, simulation});
}

export function guesstimates(metric, graph) {
  return graph.guesstimates.filter(g => (g.metric === metric.id))
}
