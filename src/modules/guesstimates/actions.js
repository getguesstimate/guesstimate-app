export function changeGuesstimate(metricId, values) {
  return { type: 'CHANGE_GUESSTIMATE', metricId, values };
}
