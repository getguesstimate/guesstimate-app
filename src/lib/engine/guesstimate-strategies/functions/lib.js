export function inputMetrics(functionInput, dGraph) {
  if (!_.has(dGraph, 'metrics')){ return [] }
  return dGraph.metrics.filter((m) => { return functionInput.includes(m.readableId); });
}
