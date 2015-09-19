import GuesstimateForm from '../models/guesstimate-form'

export default function guesstimateForm(state = {}, metrics, action) {
  let form = null
  switch (action.type) {
  case 'CREATE_GUESSTIMATE_FORM':
    return {}
  case 'DESTROY_GUESSTIMATE_FORM':
    return {}
  return { type: 'ADD_METRIC_INPUT_TO_EDITING_METRIC', metric};
  case 'UPDATE_GUESSTIMATE_FORM':
    form = new GuesstimateForm(action.value, metrics);
    return form.toJSON();
  case 'ADD_METRIC_INPUT_TO_GUESSTIMATE_FORM':
    let newInput = state.input + action.metric.id;
    form = new GuesstimateForm(newInput, metrics);
    return form.toJSON();
  default:
    return state
  }
}

