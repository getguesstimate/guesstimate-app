import {changeGuesstimate} from 'gModules/guesstimates/actions.js'
import engine from 'gEngine/engine'

export function createGuesstimateForm(metricId) {
  return (dispatch, getState) => {
    const guesstimate = getState().guesstimates.find(e => e.metric === metricId)
    dispatch({ type: 'CREATE_GUESSTIMATE_FORM', guesstimate: engine.guesstimate.format(guesstimate) })
  }
}

export function destroyGuesstimateForm() {
  return { type: 'DESTROY_GUESSTIMATE_FORM' };
}

export function updateGuesstimateForm(values) {
  return { type: 'UPDATE_GUESSTIMATE_FORM', values };
}

//This is obviously messy, we'll need some other way of getting the State and dispatch from the propogation lib
export function changeGuesstimateForm(values, skipSimulations = false) {
  return (dispatch, getState) => {
    dispatch(updateGuesstimateForm(values));
    if (skipSimulations) {
      return
    }
    const state = getState()
    const metricId = state.guesstimateForm.metric
    dispatch({type: 'RUN_FORM_SIMULATIONS', getState, dispatch, metricId});
  };
}

export function saveGuesstimateForm() {
  return (dispatch, getState) => {
    const guesstimateForm = engine.guesstimate.format(getState().guesstimateForm)
    const oldGuesstimate = getState().guesstimates.find(e => (e.metric === guesstimateForm.metric))
    let newGuesstimate = Object.assign({}, oldGuesstimate, guesstimateForm)

    if (!_.isEqual(oldGuesstimate, newGuesstimate)) {
      dispatch(changeGuesstimate(guesstimateForm.metric, newGuesstimate));
    }
  };
}
