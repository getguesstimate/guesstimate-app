import uuid from 'node-uuid'

export function addMetric(item) {
  item.id = uuid.v1()
  return { type: 'ADD_METRIC', item};
}

export function removeMetric(id) {
  return { type: 'REMOVE_METRIC', item: {id: id}};
}

export function changeMetric(item) {
  return { type: 'CHANGE_METRIC', item };
}
