import uuid from 'node-uuid'

export function addMetric(item) {
  item.id = uuid.v1()
  return { type: 'ADD_METRIC', item};
}

export function removeMetric(id) {
  return { type: 'REMOVE_METRIC', item: {id: id}};
}

export function changeMetric(item) {
  return (dispatch, getState) => {
    let state = getState()
    let metric = state.metrics.find(m => m.id === item.id)
    if (!metric.readableId && item.name) {
      item.readableId = 'WO8'
    }
    dispatch({ type: 'CHANGE_METRIC', item });
  }
}
