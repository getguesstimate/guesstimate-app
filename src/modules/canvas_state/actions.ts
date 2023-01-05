import { canvasStateSlice } from "./slice";

export const {
  change,
  changeMetricClickMode,
  analyzeMetricId,
  endAnalysis,
  toggleView,
  allowEdits,
  clearEditsAllowed,
  forbidEdits,
  changeActionState,
} = canvasStateSlice.actions;
