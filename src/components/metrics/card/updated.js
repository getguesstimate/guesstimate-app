export function hasMetricUpdated(oldProps, newProps) {
  return (
    oldProps.metric.isNew ||
    oldProps.isSelected !== newProps.isSelected ||
    oldProps.canvasState.metricCardView !== newProps.canvasState.metricCardView ||
    oldProps.canvasState.metricClickMode !== newProps.canvasState.metricClickMode ||
    oldProps.canvasState.saveState !== newProps.canvasState.saveState ||
    oldProps.hovered !== newProps.hovered ||
    !!oldProps.metric.simulation !== !!newProps.metric.simulation ||
    (!!oldProps.metric.simulation && (oldProps.metric.simulation.propagationId !== newProps.metric.simulation.propagationId)) ||
    !!oldProps.metric.guesstimate !== !!newProps.metric.guesstimate ||
    oldProps.metric.guesstimate.description !== newProps.metric.guesstimate.description
  )
}
