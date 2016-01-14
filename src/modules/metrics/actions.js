import e from 'gEngine/engine';
import * as spaceActions from 'gModules/spaces/actions.js'

function findSpaceId(getState, metricId) {
  const metric = e.metric.get(getState().metrics, metricId)
  return _.get(metric, 'space')
}

function registerGraphChange(dispatch, spaceId) {
  spaceId && dispatch(spaceActions.registerGraphChange(spaceId));
}

export function addMetric(item) {
  return (dispatch, getState) => {
    const spaceMetrics = getState().metrics.filter(m => m.space === item.space)
    const existingReadableIds = spaceMetrics.map(m => m.readableId)
    let newItem = Object.assign(item, e.metric.create(existingReadableIds))

    dispatch({ type: 'ADD_METRIC', item: newItem });
  }
}

//spaceId must be done before the metric is removed here.
export function removeMetric(id) {
  return (dispatch, getState) => {
    const spaceId = findSpaceId(getState, id)

    dispatch({ type: 'REMOVE_METRIC', item: {id: id}});
    registerGraphChange(dispatch, spaceId)
  }
}

export function changeMetric(item) {
  return (dispatch, getState) => {
    dispatch({ type: 'CHANGE_METRIC', item });
    registerGraphChange(dispatch, findSpaceId(getState, item.id))
  }
}
