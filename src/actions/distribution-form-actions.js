export function createDistributionForm(value) {
  return { type: 'CREATE_DISTRIBUTION_FORM', value };
}

export function destroyDistributionForm() {
  return { type: 'DESTROY_DISTRIBUTION_FORM' };
}

export function updateDistributionForm(value) {
  return { type: 'UPDATE_DISTRIBUTION_FORM', value };
}

export function addMetricInputToDistributionForm(metric) {
  return { type: 'ADD_METRIC_INPUT_TO_DISTRIBUTION_FORM', metric};
}

