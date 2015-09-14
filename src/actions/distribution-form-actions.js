export function createDistributionForm(value) {
  return { type: 'CREATE_DISTRIBUTION_FORM', value };
}

export function destroyDistributionForm() {
  return { type: 'DESTROY_DISTRIBUTION_FORM' };
}

export function updateDistributionForm(value) {
  return { type: 'UPDATE_DISTRIBUTION_FORM', value };
}
