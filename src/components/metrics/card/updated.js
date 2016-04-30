export function hasMetricUpdated(oldProps, newProps) {
  return (
    _.get(newProps,'canvasState.metricCardView') === 'analysis' ||
    oldProps.isSelected !== newProps.isSelected ||
    oldProps.canvasState.metricCardView !== newProps.canvasState.metricCardView ||
    oldProps.canvasState.metricClickMode !== newProps.canvasState.metricClickMode ||
    oldProps.canvasState.saveState !== newProps.canvasState.saveState ||
    !!oldProps.metric.simulation !== !!newProps.metric.simulation ||
    (!!oldProps.metric.simulation && (oldProps.metric.simulation.propagationId !== newProps.metric.simulation.propagationId))
  )
}
