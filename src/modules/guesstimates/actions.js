import * as spaceActions from 'gModules/spaces/actions'
import engine from 'gEngine/engine'

function registerGraphChange(dispatch, getState, metricId) {
  const metric = engine.metric.get(getState().metrics, metricId)
  const spaceId =  _.get(metric, 'space')
  spaceId && dispatch(spaceActions.registerGraphChange(spaceId))
}

export function changeGuesstimate(metricId, values) {
  return (dispatch, getState) => {
    const formatted = engine.guesstimate.format(values)
    dispatch({ type: 'CHANGE_GUESSTIMATE', metricId, values: formatted })
    registerGraphChange(dispatch, getState, metricId)
  }
}
