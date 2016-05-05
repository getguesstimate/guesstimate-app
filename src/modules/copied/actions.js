import e from 'gEngine/engine'
import * as metricActions from 'gModules/metrics/actions'

function isAtLocation(metric, location) {
  return metric.location.row === location.row && metric.location.column === location.column
}

export function copy(spaceId){
  return (dispatch, getState) => {
    const state = getState()

    const location = state.selection
    const metric = Object.assign({}, state.metrics.find(m => m.space === spaceId && isAtLocation(m, location)))
    const guesstimate = state.guesstimates.find(g => g.metric === metric.id)

    dispatch({type: "COPY", copied: {metric, guesstimate}})
  }
}

export function paste(spaceId){
  return (dispatch, getState) => {
    const state = getState()
    if (!(state.copied && state.selection)) { return }

    const {metric, guesstimate} = state.copied

    const location = state.selection
    const spaceMetrics = getState().metrics.filter(m => m.space === spaceId)
    const existingMetric = spaceMetrics.find(m => isAtLocation(m, location))
    const existingReadableIds = spaceMetrics.map(m => m.readableId)

    let newMetric = e.metric.create(existingReadableIds)
    newMetric.location = location
    const newItem = Object.assign({}, metric, newMetric)

    const newGuesstimate = Object.assign({}, guesstimate, {metric: newItem.id})

    if (existingMetric) {
      dispatch(metricActions.removeMetric(existingMetric.id))
    }

    dispatch({ type: 'ADD_METRIC', item: newItem, newGuesstimate });
    // TODO(Ozzie): Ozzie, is this going to cause a race condition? Or are redux dispatches synchronous?
    dispatch({ type: 'RUN_FORM_SIMULATIONS', getState, dispatch, metricId: newItem.id });
  }
}
