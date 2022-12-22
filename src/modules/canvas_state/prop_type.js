import PT from "prop-types";

export const edgeView = PT.oneOf(["hidden", "visible"]);

export const metricClickMode = PT.oneOf(["DEFAULT", "FUNCTION_INPUT_SELECT"]);

export const canvasViewState = PT.shape({
  analysisViewEnabled: PT.bool,
  scientificViewEnabled: PT.bool,
  expandedViewEnabled: PT.bool,
  edgeView,
});

export const canvasState = PT.shape({
  metricClickMode,
  edgeView,
});

export const saveState = PT.oneOf(["NONE", "SAVING", "ERROR", "SAVED"]);

export const analysisMetricId = PT.string;

export default PT.shape({
  edgeView: edgeView.isRequired,
  metricClickMode: metricClickMode.isRequired,
  saveState: saveState.isRequired,
  analysisMetricId: analysisMetricId.isRequired,
});
