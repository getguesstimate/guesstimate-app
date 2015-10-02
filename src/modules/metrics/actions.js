import uuid from 'node-uuid'

export function addMetric(location) {
  let id = uuid.v1()
  return { type: 'ADD_METRIC', item: {location, id}};
}

export function removeMetric(id) {
  return { type: 'REMOVE_METRIC', item: {id: id}};
}

export function changeMetric(item) {
  return { type: 'CHANGE_METRIC', item };
}
