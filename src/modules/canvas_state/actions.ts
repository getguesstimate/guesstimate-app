import _ from "lodash";
import { presentOrVal } from "gEngine/utils";
import { AppThunk } from "gModules/store";

export const change = (values) => ({ type: "CHANGE_CANVAS_STATE", values });

export function clearEditsAllowed(): AppThunk {
  return (dispatch) => {
    dispatch(changeActionState(""));
    dispatch(change({ editsAllowed: null, editsAllowedManuallySet: false }));
  };
}

export function allowEdits(): AppThunk {
  return (dispatch) => {
    dispatch(changeActionState(""));
    dispatch(change({ editsAllowed: true, editsAllowedManuallySet: true }));
  };
}

export function forbidEdits(editsAllowedManuallySet = true): AppThunk {
  return (dispatch) => {
    dispatch(changeActionState(""));
    dispatch(change({ editsAllowed: false, editsAllowedManuallySet: true }));
  };
}

export function toggleView(view): AppThunk {
  return (dispatch, getState) => {
    const {
      canvasState: {
        analysisViewEnabled,
        expandedViewEnabled,
        scientificViewEnabled,
      },
    } = getState();
    let values: any = {};
    switch (view) {
      case "analysis":
        values.analysisViewEnabled = !analysisViewEnabled;
        break;
      case "expanded":
        values.expandedViewEnabled = !expandedViewEnabled;
        break;
      case "scientific":
        values.scientificViewEnabled = !scientificViewEnabled;
        break;
    }
    if (!_.isEmpty(values)) {
      dispatch({ type: "CHANGE_CANVAS_STATE", values });
    }
  };
}

export const changeMetricClickMode = (clickMode) =>
  change({ metricClickMode: presentOrVal(clickMode, "DEFAULT") });
export const changeActionState = (actionState) => change({ actionState });
export const analyzeMetricId = (analysisMetricId) =>
  change({ analysisMetricId });
export const endAnalysis = () => change({ analysisMetricId: "" });
