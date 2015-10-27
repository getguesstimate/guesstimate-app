const initialState = {
  metricCardView: 'scientific',
  edgeView: 'hidden'
}

export default function canvasState(state = initialState, action) {
  switch (action.type) {
  case 'CHANGE_CANVAS_STATE':
    return Object.assign(state, action.values)
  default:
    return state
  }
}
