import { canvasStateSlice } from "./slice";
export type {
  CanvasActionState,
  CanvasState,
  EdgeViewMode,
  MetricClickMode,
} from "./slice";

export const canvasStateR = canvasStateSlice.reducer;
