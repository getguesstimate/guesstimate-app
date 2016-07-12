import e from 'gEngine/engine'
import * as spaceActions from 'gModules/spaces/actions'

import {isWithinRegion} from 'lib/locationUtils.js'

function findSpaceId(getState, metricId) {
  const metric = e.metric.get(getState().metrics, metricId)
  return _.get(metric, 'space')
}

function registerGraphChange(dispatch, spaceId) {
  spaceId && dispatch(spaceActions.registerGraphChange(spaceId))
}

export function addMetric(item) {
  return (dispatch, getState) => {
    const spaceMetrics = getState().metrics.filter(m => m.space === item.space)
    const existingReadableIds = spaceMetrics.map(m => m.readableId)
    let newItem = Object.assign({}, item, e.metric.create(existingReadableIds))

    dispatch({ type: 'ADD_METRIC', item: newItem })
  }
}

//spaceId must be done before the metric is removed here.
export function removeMetrics(ids) {
  return (dispatch, getState) => {
    if (ids.length === 0) { return }
    const spaceId = findSpaceId(getState, ids[0])
    dispatch({ type: 'REMOVE_METRICS', item: {ids}});
    registerGraphChange(dispatch, spaceId)
  }
}

export function removeSelectedMetrics(spaceId) {
  return (dispatch, getState) => {
    const state = getState()
    const region = state.selectedRegion
    const metrics = state.metrics.filter(m => m.space === spaceId && isWithinRegion(m.location, region))
    dispatch(removeMetrics(metrics.map(m => m.id)))
  }
}

export function changeMetric(item) {
  return (dispatch, getState) => {
    dispatch({ type: 'CHANGE_METRIC', item })
    registerGraphChange(dispatch, findSpaceId(getState, item.id))
  }
}
