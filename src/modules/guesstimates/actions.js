import {runMetricSimulations} from 'gModules/simulations/actions.js'

export function changeGuesstimate(metricId, values) {
  return (dispatch) => {
    let relevantKeys = ['input', 'metric', 'guesstimateType', 'description']
    dispatch({ type: 'CHANGE_GUESSTIMATE', metricId, values: _.pick(values, ...relevantKeys) })
  };
}
