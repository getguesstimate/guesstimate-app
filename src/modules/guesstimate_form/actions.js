import {runFormSimulations} from 'gModules/simulations/actions.js'
import {changeGuesstimate} from 'gModules/guesstimates/actions.js'

export function createGuesstimateForm(guesstimate) {
  return { type: 'CREATE_GUESSTIMATE_FORM', guesstimate };
}

export function destroyGuesstimateForm() {
  return { type: 'DESTROY_GUESSTIMATE_FORM' };
}

export function updateGuesstimateForm(guesstimate) {
  return { type: 'UPDATE_GUESSTIMATE_FORM', guesstimate };
}

export function changeGuesstimateForm(guesstimate) {
  return (dispatch) => {
    dispatch(updateGuesstimateForm(guesstimate));
    dispatch(runFormSimulations(guesstimate.metric));
  };
}

export function saveGuesstimateForm() {
  return (dispatch, getState) => {
    const guesstimateForm = getState().guesstimateForm
    dispatch(changeGuesstimate(guesstimateForm.metric, guesstimateForm));
  };
}
