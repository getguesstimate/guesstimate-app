import PT from "prop-types";

type EdgeView = "hidden" | "visible";

type MetricClickMode = "DEFAULT" | "FUNCTION_INPUT_SELECT";

export type CanvasViewState = {
  analysisViewEnabled: boolean;
  scientificViewEnabled: boolean;
  expandedViewEnabled: boolean;
  edgeView: EdgeView;
};

export type CanvasState = {
  metricClickMode: MetricClickMode;
  edgeView: EdgeView;
};

// export const saveState = PT.oneOf(["NONE", "SAVING", "ERROR", "SAVED"]);

// export const analysisMetricId = PT.string;

// export default PT.shape({
//   edgeView: edgeView.isRequired,
//   metricClickMode: metricClickMode.isRequired,
//   saveState: saveState.isRequired,
//   analysisMetricId: analysisMetricId.isRequired,
// });
