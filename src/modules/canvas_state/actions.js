export function change(values) {
  return { type: 'CHANGE_CANVAS_STATE', values };
}

export function changeMetricClickMode(metricClickMode) {
  if (_.isUndefined(metricClickMode) || metricClickMode === '' ) {
    return { type: 'CHANGE_CANVAS_STATE', values: {metricClickMode: 'DEFAULT'}};
  } else {
    return { type: 'CHANGE_CANVAS_STATE', values: {metricClickMode}};
  }
}

export function changeSaveState(value) {
  return { type: 'CHANGE_CANVAS_STATE', values: {saveState: value} };
}
