import {runMetricSimulations} from 'gModules/simulations/actions.js'
import * as spaceActions from 'gModules/spaces/actions.js'
import engine from 'gEngine/engine'

function registerChange(dispatch, getState, metricId) {
  const metric = engine.metric.get(getState().metrics, metricId)
  const spaceId =  _.get(metric, 'space')
  spaceId && dispatch(spaceActions.registerChange(spaceId));
}

export function changeGuesstimate(metricId, values) {
  return (dispatch, getState) => {
    let relevantKeys = ['input', 'metric', 'guesstimateType', 'description']
    dispatch({ type: 'CHANGE_GUESSTIMATE', metricId, values: _.pick(values, ...relevantKeys) })
    registerChange(dispatch, getState, metricId)
  };
}
