import e from 'gEngine/engine';
import uuid from 'node-uuid';

export function addMetric(item) {
  return (dispatch, getState) => {
    const existingReadableIds = getState().metrics.map(m => m.readableId)
    let newItem = Object.assign(item, e.metric.create(existingReadableIds))
    dispatch({ type: 'ADD_METRIC', item: newItem });
  }
}

export function removeMetric(id) {
  return { type: 'REMOVE_METRIC', item: {id: id}};
}

export function changeMetric(item) {
  return { type: 'CHANGE_METRIC', item };
}
