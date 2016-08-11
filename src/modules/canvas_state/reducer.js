const initialState = {
  analysisViewEnabled: false,
  expandedViewEnabled: false,
  scientificViewEnabled: false,
  edgeView: 'visible',
  metricClickMode: 'DEFAULT',
  saveState: 'NONE',
  editsAllowed: true,
}

export function canvasStateR(state = initialState, action) {
  switch (action.type) {
    case 'CHANGE_CANVAS_STATE': {
      return {...state, ...action.values}
    }
    default:
      return state
  }
}
