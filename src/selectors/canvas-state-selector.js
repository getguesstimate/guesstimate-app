import { createSelector } from 'reselect';
import GuesstimateForm from '../models/guesstimate-form';

const guesstimateFormSelector = state => state.guesstimateForm;

let chooseCanvasState = (guesstimateForm) => {
    if (Object.keys(guesstimateForm).length === 0){
      return 'selecting';
    } else {
      return new GuesstimateForm(guesstimateForm.input).toEditorState();
    }
}

export const canvasStateSelector = createSelector(
  guesstimateFormSelector,
  (guesstimateForm) => {
    return {
      canvasState: chooseCanvasState(guesstimateForm)
    };
  }
);
