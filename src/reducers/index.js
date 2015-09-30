import { combineReducers } from 'redux';
import _ from 'lodash'

import {addMetric, changeMetric} from '../actions/metric-actions.js'
import guesstimateFormR from './guesstimate-form-reducer'
import selectionR from './selection-reducer'
import metricsR from './metrics-reducer'
import guesstimatesR from './guesstimates-reducer'
import simulationsR from './simulations-reducer'

export function changeSelect(location) {
  return { type: 'CHANGE_SELECT', location };
}

const rootReducer = function app(state = {}, action){
  return {
    metrics: metricsR(state.metrics, action),
    guesstimates: guesstimatesR(state.guesstimates, action),
    selection: selectionR(state.selection, action),
    guesstimateForm: guesstimateFormR(state.guesstimateForm, state.metrics, state.guesstimates, action),
    simulations: simulationsR(state.simulations, action)
  };
};
export default rootReducer;

//const rootReducer = combineReducers({
  //metrics,
  //selection,
  //guesstimateForm
//});
//export default rootReducer;
