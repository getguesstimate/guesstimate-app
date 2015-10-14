import guesstimateFormR from './guesstimate_form/reducer'
import selectionR from './selection/reducer'
import metricsR from './metrics/reducer'
import guesstimatesR from './guesstimates/reducer'
import simulationsR from './simulations/reducer'
import meR from './me/reducer'
import reduxCrud from 'redux-crud';
import {reducer as formReducer} from 'redux-form';

export function changeSelect(location) {
  return { type: 'CHANGE_SELECT', location };
}

const rootReducer = function app(state = {}, action){
  return {
    metrics: metricsR(state.metrics, action),
    guesstimates: guesstimatesR(state.guesstimates, action),
    selection: selectionR(state.selection, action),
    guesstimateForm: guesstimateFormR(state.guesstimateForm, state.metrics, state.guesstimates, action),
    simulations: simulationsR(state.simulations, action),
    spaces: reduxCrud.reducersFor('spaces')(state.spaces, action),
    users: reduxCrud.reducersFor('users')(state.users, action),
    form: formReducer(state.form, action),
    me: meR(state.me, action),
  };
};


export default rootReducer;

