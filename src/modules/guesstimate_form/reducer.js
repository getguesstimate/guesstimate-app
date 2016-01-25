/* @flow soft */
import type {Guesstimate, Metric} from '../../lib/engine/types.js'
import engine from 'gEngine/engine'

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
    let newVersion = engine.guesstimate.update(state, action.values)
    return newVersion
  default:
    return state
  }
}

