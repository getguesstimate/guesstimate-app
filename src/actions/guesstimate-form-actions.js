export function createGuesstimateForm(value) {
  return { type: 'CREATE_GUESSTIMATE_FORM', value };
}

export function destroyGuesstimateForm() {
  return { type: 'DESTROY_GUESSTIMATE_FORM' };
}

export function updateGuesstimateForm(value) {
  return { type: 'UPDATE_GUESSTIMATE_FORM', value };
}

export function addMetricInputToGuesstimateForm(metric) {
  return { type: 'ADD_METRIC_INPUT_TO_GUESSTIMATE_FORM', metric};
}

