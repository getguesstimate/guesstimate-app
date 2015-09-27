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
