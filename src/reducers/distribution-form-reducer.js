import InputToGuesstimate from '../lib/input-to-guesstimate'

export default function distributionForm(state = {}, action) {
  let guesstimate = null
  switch (action.type) {
  case 'CREATE_DISTRIBUTION_FORM':
    guesstimate = new InputToGuesstimate(action.value).toGuesstimate()
    return {input: action.value, guesstimate}
  case 'DESTROY_DISTRIBUTION_FORM':
    return {}
  return { type: 'ADD_METRIC_INPUT_TO_EDITING_METRIC', metric};
  case 'UPDATE_DISTRIBUTION_FORM':
    guesstimate = new InputToGuesstimate(action.value).toGuesstimate()
    return {input: action.value, guesstimate}
  case 'ADD_METRIC_INPUT_TO_DISTRIBUTION_FORM':
    let newInput = state.input + action.metric.id
    return Object.assign(state, {newInput: newInput})
  default:
    return state
  }
}

