const initialState = {
  metricCardView: 'normal',
  edgeView: 'hidden',
  metricClickMode: 'DEFAULT'
}

export default function canvasState(state = initialState, action) {
  switch (action.type) {
  case 'CHANGE_CANVAS_STATE':
    return Object.assign(state, action.values)
  default:
    return state
  }
}
