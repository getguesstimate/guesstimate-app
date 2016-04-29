export function change(values) {
  return { type: 'CHANGE_CANVAS_STATE', values };
}

export function changeMetricClickMode(metricClickMode) {
  if (_.isUndefined(metricClickMode) || metricClickMode === '' ) {
    console.log("Changing metric click mode: ", 'DEFAULT')
    return { type: 'CHANGE_CANVAS_STATE', values: {metricClickMode: 'DEFAULT'}};
  } else {
    console.log("Changing metric click mode: ", metricClickMode)
    return { type: 'CHANGE_CANVAS_STATE', values: {metricClickMode}};
  }
}

export function changeActionState(value) {
  return { type: 'CHANGE_CANVAS_STATE', values: {actionState: value} };
}
