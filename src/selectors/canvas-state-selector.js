import { createSelector } from 'reselect';
import InputToGuesstimate from '../lib/input-to-guesstimate';

const distributionFormSelector = state => state.distributionForm;

let chooseCanvasState = (distributionForm) => {
    if (Object.keys(distributionForm).length === 0){
      return 'selecting';
    } else {
      let foo = new InputToGuesstimate(distributionForm.input).toEditorState()
      return foo
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
