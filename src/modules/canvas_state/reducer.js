const initialState = {
  analysisViewEnabled: false,
  expandedViewEnabled: false,
  scientificViewEnabled: false,
  edgeView: 'visible',
  metricClickMode: 'DEFAULT',
  saveState: 'NONE',
  editsAllowed: true,
}

export default function canvasState(state = initialState, action) {
  switch (action.type) {
    case 'CHANGE_CANVAS_STATE':
      return {...state, ...action.values}
    default:
      return state
  }
}
