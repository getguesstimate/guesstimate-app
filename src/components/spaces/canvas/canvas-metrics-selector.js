import { createSelector } from 'reselect';
import e from 'gEngine/engine'

const guesstimateFormSelector = state => state.guesstimateForm;

let chooseCanvasState = (guesstimateForm) => {
    if (Object.keys(guesstimateForm).length === 0){
      return 'selecting';
    } else {
      return e.guesstimate.toEditorState(guesstimateForm)
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
