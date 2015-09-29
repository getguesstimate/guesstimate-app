import {runFormSimulations} from './simulation-actions.js'

export function createGuesstimateForm(guesstimate) {
  return { type: 'CREATE_GUESSTIMATE_FORM', guesstimate };
}

export function destroyGuesstimateForm() {
  return { type: 'DESTROY_GUESSTIMATE_FORM' };
}

export function updateGuesstimateForm(guesstimate) {
  return { type: 'UPDATE_GUESSTIMATE_FORM', guesstimate };
}

export function addMetricInputToGuesstimateForm(metric) {
  return { type: 'ADD_METRIC_INPUT_TO_GUESSTIMATE_FORM', metric};
}

export function changeGuesstimateForm(guesstimate) {
  return (dispatch) => {
    dispatch(updateGuesstimateForm(guesstimate));
    dispatch(runFormSimulations(guesstimate.metric));
  };
}
