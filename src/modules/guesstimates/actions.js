import {runMetricSimulations} from 'gModules/simulations/actions.js'

export function submitManualGuesstimate(metricId, guesstimate) {
  return (dispatch) => {
    dispatch(changeGuesstimate(metricId, guesstimate));
    dispatch(runMetricSimulations(metricId));
  };
}

export function changeGuesstimate(metricId, values) {
  let relevantKeys = ['input', 'metric', 'guesstimateType']
  return { type: 'CHANGE_GUESSTIMATE', metricId, values: _.pick(values, ...relevantKeys) };
}
