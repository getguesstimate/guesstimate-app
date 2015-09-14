export function selectEditingMetric(metricId) {
  return { type: 'SELECT_EDITING_METRIC', metricId};
}

export function deselectEditingMetric(metricId) {
  return { type: 'DESELECT_EDITING_METRIC', metricId};
}

export function changeEditingMetric(values) {
  return { type: 'CHANGE_EDITING_METRIC', values};
}

