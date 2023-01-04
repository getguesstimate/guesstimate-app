import { AnyAction, Reducer } from "redux";

export type CanvasState = {
  analysisViewEnabled: boolean;
  expandedViewEnabled: boolean;
  scientificViewEnabled: boolean;
  edgeView: string; // TODO - enum
  metricClickMode: string; // TODO - enum
  saveState: string; // TODO - enum
  editsAllowed: boolean;
  editsAllowedManuallySet: boolean;
  analysisMetricId: string;
  actionState?: string;
};

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

export const canvasStateR: Reducer<CanvasState, AnyAction> = (
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
