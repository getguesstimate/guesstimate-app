import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CanvasActionState =
  | "CREATING"
  | "CREATED"
  | "COPYING"
  | "COPIED"
  | "ERROR_CREATING"
  | "ERROR_COPYING"
  | "ERROR"
  | "SAVING"
  | "SAVED"
  | "CONFLICT"
  | "UNALLOWED_ATTEMPT"
  | "";

export type MetricClickMode = "DEFAULT" | "FUNCTION_INPUT_SELECT";

export type EdgeViewMode = "hidden" | "visible";

// FIXME - rename, collides with DOM builtin
export type CanvasState = {
  analysisViewEnabled: boolean;
  expandedViewEnabled: boolean;
  scientificViewEnabled: boolean;
  edgeView: EdgeViewMode;
  metricClickMode: MetricClickMode;
  saveState: "NONE" | "SAVING" | "ERROR" | "SAVED";
  editsAllowed: boolean;
  editsAllowedManuallySet: boolean;
  analysisMetricId: string;
  actionState: CanvasActionState;
};

export const initialCanvasState: CanvasState = {
  analysisViewEnabled: false,
  expandedViewEnabled: false,
  scientificViewEnabled: false,
  edgeView: "visible",
  metricClickMode: "DEFAULT",
  saveState: "NONE",
  editsAllowed: true,
  editsAllowedManuallySet: false,
  analysisMetricId: "",
  actionState: "",
};

export const canvasStateSlice = createSlice({
  name: "canvasState",
  initialState: initialCanvasState,
  reducers: {
    change(state, action: PayloadAction<Partial<CanvasState>>) {
      return { ...state, ...action.payload };
    },
    clearEditsAllowed(state) {
      state.actionState = "";
      state.editsAllowed = false;
      state.editsAllowedManuallySet = false;
    },
    allowEdits(state) {
      state.actionState = "";
      state.editsAllowed = true;
      state.editsAllowedManuallySet = true;
    },

    forbidEdits(state) {
      state.actionState = "";
      state.editsAllowed = false;
      state.editsAllowedManuallySet = true;
    },

    toggleView(state, action: PayloadAction<string>) {
      switch (action.payload) {
        case "analysis":
          state.analysisViewEnabled = !state.analysisViewEnabled;
          break;
        case "expanded":
          state.expandedViewEnabled = !state.expandedViewEnabled;
          break;
        case "scientific":
          state.scientificViewEnabled = !state.scientificViewEnabled;
          break;
      }
    },

    changeMetricClickMode(state, action: PayloadAction<MetricClickMode>) {
      state.metricClickMode = action.payload;
    },
    changeActionState(state, action: PayloadAction<CanvasActionState>) {
      state.actionState = action.payload;
    },
    analyzeMetricId(state, action: PayloadAction<string>) {
      state.analysisMetricId = action.payload;
    },
    endAnalysis(state) {
      state.analysisMetricId = "";
    },
  },
});
