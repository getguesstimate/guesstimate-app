import uuid from 'node-uuid'

export function addMetric(location) {
  let id = uuid.v1()
  return { type: 'ADD_METRIC', location, id};
}

export function removeMetric(id) {
  return { type: 'REMOVE_METRIC', id};
}

export function changeMetricName(id, name) {
  return { type: 'CHANGE_METRIC_NAME', id, name };
}
