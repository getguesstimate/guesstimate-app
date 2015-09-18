import { createSelector } from 'reselect';
import GuesstimateForm from '../models/guesstimate-form'

const distributionFormSelector = state => state.distributionForm;

let chooseCanvasState = (distributionForm) => {
    if (Object.keys(distributionForm).length === 0){
      return 'selecting';
    } else {
      return new GuesstimateForm(distributionForm.input).toEditorState();
    }
}

export const canvasStateSelector = createSelector(
  distributionFormSelector,
  (distributionForm) => {
    return {
      canvasState: chooseCanvasState(distributionForm)
    };
  }
);
