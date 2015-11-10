import {runMetricSimulations} from 'gModules/simulations/actions.js'

export function submitManualGuesstimate(metricId, guesstimate) {
  return (dispatch) => {
    dispatch(changeGuesstimate(metricId, guesstimate));
    dispatch(runMetricSimulations(metricId));
  };
}

export function changeGuesstimate(metricId, values) {
  console.log('changing guesstimate')
  return { type: 'CHANGE_GUESSTIMATE', metricId, values };
}
