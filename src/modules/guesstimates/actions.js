import * as spaceActions from 'gModules/spaces/actions'
import engine from 'gEngine/engine'

function registerGraphChange(dispatch, getState, metricId) {
  const metric = engine.metric.get(getState().metrics, metricId)
  const spaceId =  _.get(metric, 'space')
  spaceId && dispatch(spaceActions.registerGraphChange(spaceId))
}

export function changeGuesstimate(metricId, values, runSimulations=false, shouldRegisterGraphChange=true) {
  return (dispatch, getState) => {
    const formatted = engine.guesstimate.format({...values, metric: metricId})
    dispatch({ type: 'CHANGE_GUESSTIMATE', metricId, values: formatted })

    if (shouldRegisterGraphChange) {
      registerGraphChange(dispatch, getState, metricId)
    }

    if (runSimulations) {
      const state = getState()
      dispatch({type: 'RUN_FORM_SIMULATIONS', getState, dispatch, metricId});
    }
  }
}
