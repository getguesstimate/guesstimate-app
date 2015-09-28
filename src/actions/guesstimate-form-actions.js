import GuesstimateForm from '../models/guesstimate-form'
import {runMetricSimulations, runFormSimulations} from './simulation-actions.js'

export function createGuesstimateForm(value) {
  return { type: 'CREATE_GUESSTIMATE_FORM', value };
}

export function destroyGuesstimateForm() {
  return { type: 'DESTROY_GUESSTIMATE_FORM' };
}

export function updateGuesstimateForm(value) {
  return { type: 'UPDATE_GUESSTIMATE_FORM', value };
}

export function addMetricInputToGuesstimateForm(metric) {
  return { type: 'ADD_METRIC_INPUT_TO_GUESSTIMATE_FORM', metric};
}

export function sampleGuesstimateForm(value) {
  return { type: 'UPDATE_GUESSTIMATE_FORM', value };
}

let foo = function(form, n=10) {
  return new Promise(function(resolve) {
    setTimeout(function(){
      let foobar = form.toJSON(n)
      resolve(foobar);
    }, 0.1)
  });
};

export function changeGuesstimateEnd(form) {
  return { type: 'CHANGE_GUESSTIMATE_FORM', form };
}

export function changeGuesstimateForm(value, metricId) {
  return (dispatch, getState) => {
    let state = getState();
    let form = new GuesstimateForm(value, state.metrics, state.guesstimates, metricId);
    dispatch(changeGuesstimateEnd(form.toJSON(1)));
    dispatch(runFormSimulations(metricId));
  };
}

//export function changeGuesstimateForm(value) {
  //return (dispatch, getState) => {
    //let state = getState();
    //let form = new GuesstimateForm(value, state.metrics, state.guesstimates)
    //dispatch(changeGuesstimateEnd(form.toJSON(300)));
    //foo(form, 5000)
      //.then((f) => dispatch(changeGuesstimateEnd(f)))
  //};
//}
