export function hasMetricUpdated(oldProps, newProps) {
  return (
    _.get(oldProps, 'analyzedMetric.id') !== _.get(newProps, 'analyzedMetric.id') ||
    _.get(oldProps, 'analyzedMetric.simulation.propagationId') !== _.get(newProps, 'analyzedMetric.simulation.propagationId') ||
    _.get(oldProps, 'metric.name') !== _.get(newProps, 'metric.name') ||
    !_.isEqual(oldProps.existingReadableIds, newProps.existingReadableIds) ||
    oldProps.inSelectedCell !== newProps.inSelectedCell ||
    oldProps.canvasState.metricCardView !== newProps.canvasState.metricCardView ||
    oldProps.canvasState.metricClickMode !== newProps.canvasState.metricClickMode ||
    oldProps.canvasState.saveState !== newProps.canvasState.saveState ||
    oldProps.hovered !== newProps.hovered ||
    !!oldProps.metric.simulation !== !!newProps.metric.simulation ||
    (!!oldProps.metric.simulation && (oldProps.metric.simulation.propagationId !== newProps.metric.simulation.propagationId)) ||
    !!oldProps.metric.guesstimate !== !!newProps.metric.guesstimate ||
    oldProps.metric.guesstimate.description !== newProps.metric.guesstimate.description ||
    oldProps.metric.guesstimate.guesstimateType !== newProps.metric.guesstimate.guesstimateType
  )
}
