const initialState = {
  metricCardView: 'normal',
  edgeView: 'visible',
  metricClickMode: 'DEFAULT',
  saveState: 'NONE',
  editsAllowed: true,
  editsAllowedManuallySet: false,
  analysisMetricId: ''
}

export function canvasStateR(state = initialState, action) {
  switch (action.type) {
    case 'CHANGE_CANVAS_STATE':
      return Object.assign({}, state, action.values)
    default:
      return state
  }
}
