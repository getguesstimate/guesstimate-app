export function change(values) {
  return { type: 'CHANGE_CANVAS_STATE', values };
}

export function allowEdits() {
  return (dispatch, getState) => {
    dispatch(changeActionState(''))
    dispatch({ type: 'CHANGE_CANVAS_STATE', values: { editsAllowed: true } });
  }
}

export function forbidEdits() {
  return (dispatch, getState) => {
    dispatch(changeActionState(''))
    dispatch({ type: 'CHANGE_CANVAS_STATE', values: { editsAllowed: false } });
  }
}

export function changeMetricClickMode(metricClickMode) {
  if (_.isUndefined(metricClickMode) || metricClickMode === '' ) {
    return { type: 'CHANGE_CANVAS_STATE', values: {metricClickMode: 'DEFAULT'}};
  } else {
    return { type: 'CHANGE_CANVAS_STATE', values: {metricClickMode}};
  }
}

export function changeActionState(value) {
  return { type: 'CHANGE_CANVAS_STATE', values: {actionState: value} };
}

export function analyzeMetricId(id) {
  return { type: 'CHANGE_CANVAS_STATE', values: {analysisMetricId: id} };
}

export function endAnalysis(id) {
  return { type: 'CHANGE_CANVAS_STATE', values: {analysisMetricId: ''} };
}
