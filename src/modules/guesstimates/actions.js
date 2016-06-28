import * as spaceActions from 'gModules/spaces/actions'

import engine from 'gEngine/engine'

function registerGraphChange(dispatch, getState, metricId) {
  const metric = engine.metric.get(getState().metrics, metricId)
  const spaceId =  _.get(metric, 'space')
  spaceId && dispatch(spaceActions.registerGraphChange(spaceId))
}

export function changeGuesstimate(metricId, newGuesstimate, runSimulations=false, shouldRegisterGraphChange=true) {
  return (dispatch, getState) => {
    dispatch({ type: 'CHANGE_GUESSTIMATE', metricId, values: {...newGuesstimate, metric: metricId} })

    if (shouldRegisterGraphChange) {
      registerGraphChange(dispatch, getState, metricId)
    }

    if (runSimulations) {
      const state = getState()
      dispatch({type: 'RUN_FORM_SIMULATIONS', getState, dispatch, metricId});
    }
  }
}
