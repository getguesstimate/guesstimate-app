/* @flow soft */
import type {Guesstimate, Metric} from '../lib/engine/types.js'

export default function guesstimateForm(
  state: Guesstimate = {},
  metrics: Array<Metric>,
  guesstimates: Array<Guesstimate>,
  action: Object
  ): Guesstimate {

  switch (action.type) {
  case 'CREATE_GUESSTIMATE_FORM':
    return action.guesstimate;
  case 'DESTROY_GUESSTIMATE_FORM':
    return {}
  case 'UPDATE_GUESSTIMATE_FORM':
    return action.guesstimate;
  case 'ADD_METRIC_INPUT_TO_GUESSTIMATE_FORM':
    let newInput = state.input + action.metric.id;
    return {input: newInput, metric: state.metric}
  default:
    return state
  }
}

