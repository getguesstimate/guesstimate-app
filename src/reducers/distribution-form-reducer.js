import GuesstimateForm from '../models/guesstimate-form'

export default function distributionForm(state = {}, metrics, action) {
  let form = null
  switch (action.type) {
  case 'CREATE_DISTRIBUTION_FORM':
    return {}
  case 'DESTROY_DISTRIBUTION_FORM':
    return {}
  return { type: 'ADD_METRIC_INPUT_TO_EDITING_METRIC', metric};
  case 'UPDATE_DISTRIBUTION_FORM':
    form = new GuesstimateForm(action.value, metrics);
    return form.toJSON();
  case 'ADD_METRIC_INPUT_TO_DISTRIBUTION_FORM':
    let newInput = state.input + action.metric.id;
    form = new GuesstimateForm(newInput, metrics);
    return form.toJSON();
  default:
    return state
  }
}

