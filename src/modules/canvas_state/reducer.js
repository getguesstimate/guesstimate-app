const initialState = {
  metricCardView: 'normal'
}

export default function canvasState(state = initialState, action) {
  switch (action.type) {
  case 'CHANGE_CANVAS_STATE':
    return action.values
  default:
    return state
  }
}
