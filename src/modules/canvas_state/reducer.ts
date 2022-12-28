import { AnyAction, Reducer } from "redux";

export type CanvasState = any;

const initialState: CanvasState = {
  analysisViewEnabled: false,
  expandedViewEnabled: false,
  scientificViewEnabled: false,
  edgeView: "visible",
  metricClickMode: "DEFAULT",
  saveState: "NONE",
  editsAllowed: true,
  editsAllowedManuallySet: false,
  analysisMetricId: "",
};

export const canvasStateR: Reducer<typeof initialState, AnyAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "CHANGE_CANVAS_STATE": {
      return { ...state, ...action.values };
    }
    default:
      return state;
  }
};
